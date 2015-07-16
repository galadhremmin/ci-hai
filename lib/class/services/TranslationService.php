<?php
  namespace services;
  
  class TranslationService extends ServiceBase {
    public function __construct() {
      parent::__construct();
      
      parent::registerMainMethod('getTranslation');
      parent::registerMethod('save', 'registerTranslation');
      parent::registerMethod('translate', 'translate');
      parent::registerMethod('saveReview', 'saveReview');
    }
    
    public function handleRequest(&$data) {
      throw new \ErrorException('Parameterless request presently unsupported.');
    }
    
    protected static function getTranslation($id) {
      $t = new \data\entities\Translation();
      $t->load($id);
      $t->transformContent();
      
      if ($t->index) {
        $t = null;
      }
      
      return $t;
    }
    
    protected static function registerTranslation(&$data) {
      // request access to the specified translation
      $request = new \auth\TranslationAccessRequest($data['id']);
      try {
        \auth\Credentials::request($request);
      } catch (\exceptions\InadequatePermissionsException $ex) {
        if ($request->requiresReview()) {
          // The changes must be reviewed... submit a review request
          $review = new \data\entities\TranslationReview($data);
          return $review->save();
        }
      }

      $result = self::saveTranslation($data);
      return $result;
    }
    
    protected static function translate(&$input) {    
      if (!isset($input['term']) || !is_string($input['term'])) {
        throw new \Exception("Missing parameter 'term'.");
      }

      return \data\entities\Translation::translate($input['term'], null);
    }

    protected static function saveReview(&$input) {
      if (!isset($input['reviewID']) || !is_numeric($input['reviewID'])) {
        return;
      }

      $reviewID = intval($input['reviewID']);
      $approved = $input['reviewApproved'] == 1;
      $justific = isset($input['justification']) ? $input['justification'] : null;

      // Check for permissions to make changes to the review
      \auth\Credentials::request(new \auth\TranslationReviewAccessRequest($reviewID));

      // Attempt to load the review
      $review = new \data\entities\TranslationReview();
      $review->load($reviewID);

      if (! $review->validate()) {
        // Load failed -- quit!
        return;
      }

      if ($approved) {
        self::saveTranslation($review);
        $review->approve();
      } else {

      }

      return false;
    }

    public static function saveTranslation($source) {

      $review = false;
      if ($source instanceof \data\entities\TranslationReview) {
        $data = $source->data;
        $review = true;
      } else if (is_array($source)) {
        $data = $source;
      } else {
        throw new Exception('Unrecognised source.');
      }

      $values = self::getValues($data);

      // Create a sense, if one isn't specified. Base the sense on the gloss.
      $ns = new \data\entities\Sense();
      $ns->load($values['senseID']);
      if ($ns->id == 0) {
        $ns->identifier = $values['translation'];
        $ns->save();
        $values['senseID'] = $ns->id;
      }

      // register translations
      $translationObj = new \data\entities\Translation($values);

      if ($review) {
        $cred = \auth\Credentials::copyFor($source->authorID);
        $result = $translationObj->transfer($cred);
      } else {
        $result = $translationObj->save();
      }

      // Register indexes
      if (isset($data['indexes']) && is_array($data['indexes'])) {
        foreach ($data['indexes'] as $indexWord) {
          $index = new \data\entities\Translation(array(
            'word'     => $indexWord,
            'language' => $translationObj->language,
            'senseID'  => $ns->id
          ));

          $index->saveIndex();
        }
      }

      return $result;
    }

    private static function getValues(&$data) {
      // retrieve values. The key maps to the REQUEST variables expected, and the
      // value defines what sort of values to be expect.
      $values = array(
        'type'        => array_keys(\data\entities\Translation::getTypes()),
        'senseID'     => '/^[0-9]+$/',
        'id'          => '/^[0-9]+$/',
        'language'    => '/^[0-9]+$/',
        'word'        => null,
        'translation' => null,
        'etymology'   => null,
        'source'      => null,
        'comments'    => null,
        'tengwar'     => null,
        'phonetic'    => null
      );

      foreach ($values as $key => $validation) {
        if (!isset($data[$key])) {
          throw new \Exception('Missing parameter: '.$key);
        }

        $value = $data[$key];

        if ($validation !== null) {
          if ((is_array($validation) && !in_array($value, $validation)) ||
            (is_string($validation) && !preg_match($validation, $value))) {

            if (is_array($validation)) {
              $validationValues = implode(', ', $validation);
            }

            throw new \Exception('Malformed parameter: '.$key.'. Received "'.$value.'", expected '.$validationValues);
          }
        }

        $values[$key] = stripslashes($value);
      }

      return $values;
    }
  }
