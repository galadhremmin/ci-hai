<?php
  if (!defined('SYS_ACTIVE')) {
    exit;
  }
  
  class DictionaryNamespace extends Entity {
    public $id;
    public $identifier;
  
    public function __construct($data = null) {
      $fields = get_object_vars($this);
      
      foreach ($fields as $field => $type) {
        if (isset($data[$field])) {
          $this->$field = $data[$field];
        }
      }
    }
  
    public function load($id) {
      $db = Database::instance()->connection();
      $query = $db->prepare(
        'SELECT w.`Key` FROM `namespace` n
         LEFT JOIN `word` w ON w.`KeyID` = n.`IdentifierID`
         WHERE n.`NamespaceID` = ?'
      );
      
      $query->bind_param('i', $id);
      $query->execute();
      $query->bind_result($this->identifier);
      if ($query->fetch()) {
        $this->id = $id;
      }
      $query->close();
      
      return $this;
    }
    
    public function validate() {
      return !preg_match('/^[\\s]+$/', $this->identifier);
    }
    
    public function save() {
      if (!$this->validate()) {
        throw new ErrorException('Invalid DictionaryNamespace.');
      }
    
      $db = Database::instance()->exclusiveConnection();
      
      $word = new Word();
      $word->create($this->identifier);
      
      $query = $db->prepare(
        'SELECT n.`NamespaceID`
         FROM `namespace` n
         LEFT JOIN `word` w ON w.`KeyID` = n.`IdentifierID`
         WHERE w.`Key` = ?'
      );
      $query->bind_param('i', $word->id);
      $query->execute();
      $query->bind_result($this->id);
      
      if ($query->fetch() !== true) {
        $query->close();
        
        $query = $db->prepare(
          'INSERT INTO `namespace` (`IdentifierID`) VALUES (?)'
        );
        $query->bind_param('i', $word->id);
        $query->execute();
        
        $this->id = $db->insert_id;
      }
      
      $query->close();
      
      return $this;
    }
  }
?>