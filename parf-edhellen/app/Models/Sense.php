<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;

class Sense extends Model
{
    protected $table = 'namespace';
    protected $primaryKey = 'NamespaceID';

    /**
     * Disable automatic timestamps.
     */
    public $timestamps = false;

    public function word() 
    {
        return $this->hasOne(Word::class, 'KeyID', 'IdentifierID');
    }
}