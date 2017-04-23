<?php
  namespace models;
  
  class TranslateModel {
    private $_term;
    private $_keywordIndexes;
    private $_translations;
    private $_loggedIn;
    private $_languages;
    private $_wordExists;
    private $_senses;
    private $_favourites;
    
    public function __construct() {
      $this->_translations = array();

      if (!isset($_REQUEST['term'])) {
        return;
      }
      
      $this->_term = $_REQUEST['term'];
      
      if (function_exists('get_magic_quotes_gpc') && get_magic_quotes_gpc()) {
        $this->_term = stripslashes($this->_term);
      }

      // Retrieve translation data for the specified term
      $matches = null;
      $single = false;
      if (preg_match('/^translationID=([0-9]+)$/', $this->_term, $matches)) {
        // A specified translation has been requested, so attempt to retrieve it.
        $translationID = intval($matches[1]);
        
        $data = \data\entities\Translation::translateSingle($translationID);
        if ($data !== null) {
          $this->_term = $data['translation']->word;
          $single = true;
        }
      } else {
        // Perform a broad translation search on the term specified.
        // Remove special characters.
        $this->_term = \utils\StringWizard::normalize($this->_term);
        $data = \data\entities\Translation::translate($this->_term);
      }
       
      if ($data !== null) {
        $this->_senses         = $data['senses'];
        $this->_translations   = $data['translations'];
        $this->_wordExists     = true;
        $this->_keywordIndexes = array();
        
        // Filter out repeated indexes, and preserve only the index word. 
        foreach ($data['keywordIndexes'] as $index) {
          if (!in_array($index->word, $this->_keywordIndexes)) {
            $this->_keywordIndexes[] = $index->word;
          }
        }
      } 
              
      // Retrieve all available languages
      $languages = \data\entities\Language::getAllLanguages();
      $this->_languages = array();

      foreach ($languages as $language) {
        $this->_languages[$language->name] = $language;
      }
      
      // Has the current user authenticated herself?
      $this->_loggedIn = \auth\Credentials::permitted(new \auth\BasicAccessRequest());
      $this->_favourites = array();
      if ($this->_loggedIn) {
        $account = \auth\Credentials::current()->account();
        $this->_favourites = \data\entities\Favourite::getByAccount($account, true);
      }

      if (! $single && isset($_REQUEST['languageId'])) {
        $languageId = intval($_REQUEST['languageId']);
        if ($languageId > 0) {
          $selectedLanguage = new \data\entities\Language();
          $selectedLanguage->load($languageId);

          if ($selectedLanguage->id) {
            $filteredTranslations = array();
            foreach ($this->_translations as $name => $translations) {
              if ($name === $selectedLanguage->name) {
                $filteredTranslations[$name] = $translations;
              }
            }

            if (count($filteredTranslations)) {
              $this->_translations = $filteredTranslations;
            }
          }
        }
      }
    }
    
    public function getTerm() {
      return $this->_term;
    }
    
    public function getTranslations() {
      return $this->_translations;
    }
        
    public function getLoggedIn() {
      return $this->_loggedIn;
    }
    
    public function getLanguages() {
      return $this->_languages;
    }
        
    public function getWordExists() {
      return $this->_wordExists;
    } 
    
    public function getSenses() {
      return $this->_senses;
    }
    
    public function getIndexes() {
      return $this->_keywordIndexes;
    }
    
    public function getAccountID() {
      if (! $this->_loggedIn) {
        return 0;
      }
      
      return \auth\Credentials::current()->account()->id;
    }

    public function isAdministrator() {
      return \auth\Credentials::current()->account()->isAdministrator();
    }
    
    public function getFavourites() {
      return $this->_favourites;
    }
  }
?>