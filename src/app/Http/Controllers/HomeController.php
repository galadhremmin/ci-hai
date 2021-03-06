<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use App\Repositories\ContributionRepository;
use App\Repositories\Interfaces\IAuditTrailRepository;
use App\Models\{ 
    AuditTrail,
    Sentence
};
use App\Adapters\{
    AuditTrailAdapter,
    SentenceAdapter
};

class HomeController extends Controller
{
    protected $_auditTrail;
    protected $_auditTrailAdapter;
    protected $_sentenceAdapter;
    protected $_reviewRepository;

    public function __construct(IAuditTrailRepository $auditTrail, AuditTrailAdapter $auditTrailAdapter, 
        SentenceAdapter $sentenceAdapter, ContributionRepository $ContributionRepository) 
    {
        $this->_auditTrail        = $auditTrail;
        $this->_auditTrailAdapter = $auditTrailAdapter;
        $this->_sentenceAdapter   = $sentenceAdapter;
        $this->_reviewRepository  = $ContributionRepository;
    }

    public function index() 
    {
        // Retrieve a random jumbotron background image from configuration. The background is 
        // positioned upon the jumbotron.
        $jumbotronFiles = config('ed.jumbotron_files');
        $noOfJumbotronFiles = count($jumbotronFiles);
        $background = $noOfJumbotronFiles > 0 
            ? $jumbotronFiles[mt_rand(0, $noOfJumbotronFiles - 1)] 
            : null;

        // Retrieve a random sentence to be featured.
        $randomSentence = Sentence::approved()->inRandomOrder()->first();
        $data = $randomSentence 
            ? $this->_sentenceAdapter->adaptFragments($randomSentence->sentence_fragments, false) 
            : null;

        // Retrieve the 10 latest audit trail
        $auditTrails = $this->_auditTrailAdapter->adaptAndMerge( $this->_auditTrail->get(10) );
        $data = [
            'sentence'         => $randomSentence,
            'sentenceData'     => $data,
            'auditTrails'      => $auditTrails,
            'background'       => $background
        ];
        
        return view('home.index', $data);
    }
}
