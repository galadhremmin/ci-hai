<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

use App\Helpers\StringHelper;
use App\Models\{Account, Word, Keyword, Translation, Language, TranslationGroup};
use App\Repositories\TranslationRepository;

const MAX_WORD_LENGTH = 128;

class CCCEDICTImportCommand extends Command 
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cc-cedict-import {dataSource}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Imports CC-CEDICT definitions.';
    
    protected $_translationRepository;
    public function __construct(TranslationRepository $translationRepository)
    {
        parent::__construct();
        $this->_translationRepository = $translationRepository;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $filePath = $this->argument('dataSource');
        if (! file_exists($filePath)) {
            $this->error('The file "'.$filePath.'" does not exist.');
            return;
        }

        $glosses = [];

        // Form an array of glosses from the data source.
        $fp = fopen($filePath, 'r');
        try {
            while(!feof($fp)) {
                $line = fgets($fp);
                
                if (strlen($line) < 1) {
                    continue;
                }

                if ($line[0] === '#') {
                    continue;
                }

                // Traditional and simplified word delimiters
                $pos0 = strpos($line, ' ');
                $pos1 = strpos($line, ' ', $pos0 + 1);

                // Pinyin delimiters
                $pos2 = strpos($line, '[', $pos1 + 1);
                $pos3 = strpos($line, ']', $pos2 + 1);

                // Translation delimiters
                $pos4 = strpos($line, '/', $pos3);
                $pos5 = strrpos($line, '/');

                $traditional  = substr($line, 0, $pos0);
                $simplified   = substr($line, $pos0 + 1, $pos1 - $pos0);
                $pinyin       = substr($line, $pos2 + 1, $pos3 - $pos2 - 1);
                $translations = explode('/', substr($line, $pos4 + 1, $pos5 - $pos4 - 1));

                $glosses[] = [
                    'traditional'  => $traditional, 
                    'simplified'   => $simplified,
                    'pinyin'       => $pinyin,
                    'translations' => $translations,
                    'id'           => sha1($traditional.'|'.$simplified.'|'.$pinyin)
                ];
            }
        } finally {
            fclose($fp);
            unset($fp);
        }

        // Retrieve languages (Simplified and Traditional). While these are not 'languages' per sé, they are
        // treated this way for convenience.
        $simplifiedLanguage = Language::where('name', 'Simplified')->firstOrFail();
        $traditionalLanguage = Language::where('name', 'Traditional')->firstOrFail();

        // Retrieve the user account for the Administrator account. The glossary will be associated with that account.
        $user = Account::where('nickname', 'Administrator')->firstOrFail();

        // Create a translation group for Mandarin, if one does not already exist. This will ensure that asterisks
        // (which denote hypthetical words) are not displayed.
        $group = TranslationGroup::where('name', 'Mandarin')->firstOrCreate([
            'name' => 'Mandarin', 
            'is_canon' => 1, // disables asterisks
            'is_old' => 0
        ]);

        foreach ($glosses as $gloss) {
            
            // Create a translation word from the list of translations. 
            $translation = $gloss['translations'][0];
            $comments = '';

            // If the length of the translation is beyond the maximum length for a word, try to reduce its length by...
            if (strlen($translation) >= MAX_WORD_LENGTH) {

                // Finding the position of the first comma and closing paranthesis.
                $posC = strpos($translation, ',');
                $posPS = strpos($translation, '(');
                $posP = strpos($translation, ')'); // assume that the position of the closing paranthesis is _after_ the position of the opening one.

                // Cut to either the position of the opening paranthesis, or the first comma.
                $pos = $posP !== false && $posC < $posP ? $posPS : $posC;

                $translation = substr($translation, 0, $pos);
                $comments = ucfirst(trim(substr($translation, $pos), ' ,'));
            }

            // If the translation is _still_ too long, despite the earlier step ...
            if (strlen($translation) >= MAX_WORD_LENGTH) {
                $translation = $gloss['translations'][0];

                // ... check whether it is a prefecture. If it is, trim the chinese bit (autonomous prefecture ...) and put it in the comments instead.
                if (preg_match('/prefecture\s\p{Han}+/u', $translation)) {
                    $pos = strpos($translation, 'prefecture') + 10;
                    $translation = trim(substr($translation, 0, $pos));
                    $comments = trim(substr($translation, $pos));
                }
            }
            
            // ... finally, if the translation is _still_ too long, put it all in the comment field, and provide a simple hypthen as its translation.
            // An administrator will have to review this manually.
            if (strlen($translation) >= MAX_WORD_LENGTH) {
                $translation = '-';
                $comments = $gloss['translations'][0];
            }

            // Reduce an array of keywords from the array of translations associated with this gloss. Ignore those that are longer
            // than the maximum length for words.
            $keywords = array_filter(array_slice($gloss['translations'], 1), function ($v) {
                return strlen($v) <= MAX_WORD_LENGTH;
            });

            // Idioms receive an additional keyword _idiom_.
            if (preg_match('/\bidiom\b/',$gloss['translations'][0])) {
                $keywords[] = 'idiom';
            }

            // Make pinyin searchable (with and without numerals in place of tone marks). See: https://en.wikipedia.org/wiki/Pinyin#Numerals_in_place_of_tone_marks
            /* TODO: treat pinyin as a separate 'language' to avoid mixing with English.
            $keywords[] = $gloss['pinyin'];
            $keywords[] = implode(' ', array_map(function ($v) {
                return trim($v, '012345');
            }, explode(' ', $gloss['pinyin'])));
            */

            // Add additional glosses to the comment field
            $s = implode('; ', array_slice($gloss['translations'], 1));
            if (! empty($s)) {
                $comments .= (! empty($comments) ? "\n" : '') . 'Also: '.$s;
            }

            // Create an instance of the Translation glass for traditional as well as a simplified 'languages'.
            $tt = Translation::where(['language_id' => $traditionalLanguage->id, 'external_id' => $gloss['id']])->firstOrNew([
                'language_id' => $traditionalLanguage->id,
                'translation' => $translation,
                'external_id' => $gloss['id'],
                'account_id'  => $user->id
            ]);

            $ts = Translation::where(['language_id' => $simplifiedLanguage->id, 'external_id' => $gloss['id']])->firstOrNew([
                'language_id' => $simplifiedLanguage->id,
                'translation' => $translation,
                'external_id' => $gloss['id'],
                'account_id'  => $user->id
            ]);
            
            $ts->translation = $tt->translation = $translation;
            $ts->tengwar = $tt->tengwar = $this->addToneMarks($gloss['pinyin']);
            $ts->translation_group_id = $tt->translation_group_id = $group->id;
            $ts->comments = $tt->comments = $comments;

            $this->_translationRepository->saveTranslation(
                $gloss['traditional'],
                $translation,
                $tt,
                $keywords
            );

            $this->_translationRepository->saveTranslation(
                $gloss['simplified'],
                $translation,
                $ts,
                $keywords
            );
        }
    }

    function addToneMarks(string $pinyinWithNumerals) {
        $words = explode(' ', mb_strtolower($pinyinWithNumerals));
        $pinyin = [];
        $vowelTransforms = [
            'a' => [
                1 => 'ā',
                2 => 'á',
                3 => 'ǎ',
                4 => 'à',
                5 => 'a'
            ],
            'o' => [
                1 => 'ō',
                2 => 'ó',
                3 => 'ǒ',
                4 => 'ò',
                5 => 'o'
            ], 
            'e' => [
                1 => 'ē',
                2 => 'é',
                3 => 'ě',
                4 => 'è',
                5 => 'e'
            ], 
            'i' => [
                1 => 'ī',
                2 => 'í',
                3 => 'ǐ',
                4 => 'ì',
                5 => 'i'
            ], 
            'u' => [
                1 => 'ū',
                2 => 'ú',
                3 => 'ǔ',
                4 => 'ù',
                5 => 'u'
            ]
        ];
        $vowels = array_keys($vowelTransforms);

        foreach ($words as $word) {
            $lengthOfWord = strlen($word);

            // ignore pinyin w/o a numeric tone mark, in the event that they do in fact turn up.
            $no = $word[$lengthOfWord - 1];
            if (! is_numeric($no)) {
                $pinyin[] = $word;
                continue;
            }
            $no = intval($no);

            if ($no < 1 || $no > 5) {
                throw new \Exception('Unsupported tone marker: '.$no);
            }

            // find all vowels and record their positions
            $positions = [];
            for ($i = 0; $i < $lengthOfWord - 1; $i += 1) {
                $c = $word[$i];

                if (in_array($c, $vowels)) {
                    $positions[] = $i;
                }
            }

            $vowelPosition = -1;
            $numberOfPositions = count($positions);

            if ($numberOfPositions < 1) {
                $pinyin[] = $word;
                continue;
            }
            
            if ($numberOfPositions === 1) {
                // replace the only vowel
                $vowelPosition = $positions[0]; 
            } else {
                // 1. If there is an a or an e, it will take the tone mark.
                foreach ($positions as $pos) {
                    if ($word[$pos] === 'a' || $word[$pos] === 'e') {
                        $vowelPosition = $pos;
                        break;
                    }
                }
            }

            // 2. If there is an ou, then the o takes the tone mark.
            if ($vowelPosition === -1) {
                for ($i = 0; $i < $numberOfPositions - 1; $i += 1) {
                    $pos = $positions[$i];

                    if ($word[$pos] === 'o' && $word[$pos + 1] === 'u') {
                        $vowelPosition = $pos;
                        break;
                    }
                }
            }

            // 3. Otherwise, the second vowel takes the tone mark.
            if ($vowelPosition === -1) {
                $vowelPosition = $positions[1];
            }

            $pinyin[] = substr($word, 0, $vowelPosition).
                $vowelTransforms[$word[$vowelPosition]][$no].
                substr($word, $vowelPosition + 1, $lengthOfWord - $vowelPosition - 2);
        }

        return implode(' ', $pinyin);
    }
}
