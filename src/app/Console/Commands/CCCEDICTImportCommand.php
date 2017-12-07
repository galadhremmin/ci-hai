<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

use App\Helpers\StringHelper;
use App\Models\{Account, Word, Keyword, Gloss, Language, GlossGroup, Translation};
use App\Repositories\GlossRepository;

const MAX_WORD_LENGTH = 128;

class CCCEDICTImportCommand extends Command 
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cc-cedict-import {dataSource} {--skip=0}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Imports CC-CEDICT definitions.';
    
    protected $_glossRepository;
    public function __construct(GlossRepository $glossRepository)
    {
        parent::__construct();
        $this->_glossRepository = $glossRepository;
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

                // Gloss delimiters
                $pos4 = strpos($line, '/', $pos3);
                $pos5 = strrpos($line, '/');

                $traditional  = substr($line, 0, $pos0);
                $simplified   = substr($line, $pos0 + 1, $pos1 - $pos0);
                $pinyin       = substr($line, $pos2 + 1, $pos3 - $pos2 - 1);

                // Convert the array of translations (strings) into an array of Translation objects.
                // The array_map function returns an associative array, which does not work in conjunction
                // with array_splice, as it does not rebase the array after indices were removed. Therefore, the
                // resulting associative array is passed into array_values, which yields an array compatible
                // with the necessary functionality.
                $translations = array_values(array_map(function ($t) {
                    return new Translation(['translation' => $t]);
                }, array_unique(explode('/', substr($line, $pos4 + 1, $pos5 - $pos4 - 1)))));

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
        $group = GlossGroup::where('name', 'Mandarin')->firstOrCreate([
            'name' => 'Mandarin', 
            'is_canon' => 1, // disables asterisks
            'is_old' => 0
        ]);

        $n = 0;
        $skipN = intval($this->option('skip'));
        foreach ($glosses as $gloss) {
            if ($n++ < $skipN) {
                continue;
            }

            $keywords = [];
            $allComments = [];

            // Truncate long translations
            for ($i = count($gloss['translations']) - 1; $i >= 0; $i -= 1) {
                $t = $gloss['translations'][$i];
                $translation = $t->translation;
                $comments = '';

                // If the length of the translation is beyond the maximum length for a word, try to reduce its length by...
                if (mb_strlen($translation) < MAX_WORD_LENGTH) {
                    continue;
                }

                // Finding the position of the first comma and closing paranthesis.
                $posC = strpos($translation, ',');
                $posPS = strpos($translation, '(');
                $posP = strpos($translation, ')'); // assume that the position of the closing paranthesis is _after_ the position of the opening one.
                
                // Cut to either the position of the opening paranthesis, or the first comma.
                $pos = $posP !== false && $posC < $posP ? $posPS : $posC;
                $translation = substr($translation, 0, $pos);
                $comments = ucfirst(trim(substr($translation, $pos), ' ,'));
            
                // If the translation is _still_ too long, despite the earlier step ...
                if (mb_strlen($translation) > MAX_WORD_LENGTH) {
                    // Reset
                    $translation = $gloss['translations'][$i];
                    
                    // ... check whether it is a prefecture. If it is, trim the chinese bit (autonomous prefecture ...) and put it in the comments instead.
                    if (preg_match('/prefecture\s\p{Han}+/u', $translation)) {
                        $pos = strpos($translation, 'prefecture') + 10;
                        $translation = trim(substr($translation, 0, $pos));
                        $comments = trim(substr($translation, $pos));
                    }
                }
                
                // ... finally, if the translation is _still_ too long, put it all in the comment field, and provide a simple hypthen as its translation.
                // An administrator will have to review this manually.
                if (strlen($translation) > MAX_WORD_LENGTH) {
                    $comments = $gloss['translations'][0];
                    array_splice($gloss['translations'], $i, 1);
                } else {
                    $t->translation = $translation;
                }

                if (! empty($comments)) {
                    $allComments[] = $comments;
                }
            }

            if (count($gloss['translations']) < 1) {
                $this->info('Skipped '.$gloss['simplified'].' ('.$gloss['traditional'].')');
                continue;
            }

            // Idioms receive an additional keyword _idiom_.
            $sense = $gloss['translations'][0]->translation;
            if (preg_match('/\bidiom\b/', $sense)) {
                $keywords[] = 'idiom';
            }

            // Create an instance of the Gloss glass for traditional as well as a simplified 'languages'.
            $tt = Gloss::where(['language_id' => $traditionalLanguage->id, 'external_id' => $gloss['id']])->firstOrNew([
                'language_id' => $traditionalLanguage->id,
                'external_id' => $gloss['id'],
                'account_id'  => $user->id
            ]);

            $ts = Gloss::where(['language_id' => $simplifiedLanguage->id, 'external_id' => $gloss['id']])->firstOrNew([
                'language_id' => $simplifiedLanguage->id,
                'external_id' => $gloss['id'],
                'account_id'  => $user->id
            ]);
            
            $ts->tengwar = $tt->tengwar = $this->addToneMarks($gloss['pinyin']);
            $ts->gloss_group_id = $tt->gloss_group_id = $group->id;
            $ts->comments = $tt->comments = $comments;

            try {
                $changedT = false;
                $this->_glossRepository->saveGloss(
                    $gloss['traditional'],
                    $sense,
                    $tt,
                    $gloss['translations'],
                    $keywords,
                    true,
                    $changedT
                );

                $changedS = false;
                $tss = $this->_glossRepository->saveGloss(
                    $gloss['simplified'],
                    $sense,
                    $ts,
                    $gloss['translations'],
                    $keywords,
                    true,
                    $changedS
                );
            } catch (\Exception $ex) {
                $this->error('Failed to save '.$sense);
                $this->error($ex->getMessage());
                dd($gloss);
            }
            
            if ($changedT || $changedT) {
                $this->info(($n - 1).' saved '.$sense);
            } else {
                $this->info(($n - 1).' skipped '.$sense);
            }
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
