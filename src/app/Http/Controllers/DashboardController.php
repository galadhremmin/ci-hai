<?php

namespace App\Http\Controllers;

use App\Models\{Account, Role};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        return view('dashboard.index', ['user' => $request->user()]);
    }
}