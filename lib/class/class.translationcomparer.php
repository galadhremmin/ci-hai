<?php

  class TranslationComparer {
    public static function compare(Translation $a, Translation $b) {
      if ($a->id == $b->id) {
        return 0;
      }

      if ($a->rating == $b->rating) {
        return strcmp($a->wordID, $b->wordID) < 0 ? -1 : 1;
      }

      return $a->rating - $b->rating < 0 ? -1 : 1; 
    }
  }  
