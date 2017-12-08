@inject('link', 'App\Helpers\LinkHelper')
@extends('_layouts.default')

@section('title', 'Welcome!')
@section('body')

@if ($background)
<div class="jumbotron" style="background-image:url(img/jumbotron/{{ $background }}">
@else
<div class="jumbotron">
@endif
  <h1 title="Welcome!">欢迎</h1>
  <p>
    This is a dictionary for mandarin based on CC-CEDICT.
  </p>
</div>

<hr>

<div class="row">
  <div class="col-xs-12 col-sm-6 col-md-4">
    <h4>About</h4>
    <p>
      
    </p>
    <hr class="visible-xs">
  </div>
  @if ($sentence)
  <div class="col-xs-12 col-sm-6 col-md-4">
    <h4>Random phrase</h4>
    @include('sentence.public._random', [ 
      'sentence'     => $sentence,
      'sentenceData' => $sentenceData
    ])
  </div>
  @endif
  <hr class="hidden-md hidden-lg clear-left">
  <div class="col-xs-12 col-sm-6 col-md-4">
    <h4>Community activity</h4>
    <p>
      The {{count($auditTrails)}} most recent activities.
    </p>
    @include('_shared._audit-trail', [
      'auditTrail' => $auditTrails
    ])
  </div>
</div>

@endsection
