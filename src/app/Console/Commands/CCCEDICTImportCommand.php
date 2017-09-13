<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

use App\Helpers\StringHelper;
use App\Models\{Word, Keyword};

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
                    $traditional, 
                    $simplified,
                    $pinyin,
                    $translations
                ];

                if (count($glosses) > 50) {
                    break;
                }
            }

            $this->info(print_r($glosses, true));
        } finally {
            fclose($fp);
        }
    }
}
