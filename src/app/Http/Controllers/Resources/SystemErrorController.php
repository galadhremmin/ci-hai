<?php

namespace App\Http\Controllers\Resources;

use App\Models\SystemError;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SystemErrorController extends Controller
{
    public function index(Request $request)
    {
        $errors = SystemError::take(1000)
            ->orderBy('id', 'desc')
            ->get();
            
        return view('system-error.index', ['errors' => $errors]);
    }
}