<?php

namespace App\Models;

class TranslationGroup extends ModelBase
{
    protected $fillable = ['name', 'external_link_format', 'is_canon', 'is_old'];

    public function translations() 
    {
        return $this->belongsTo(Translation::class);
    }
}
