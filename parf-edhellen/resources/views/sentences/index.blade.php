@inject('link', 'App\Helpers\LinkHelper')
@extends('_layouts.default')

@section('title', 'Phrases')
@section('body')

  {!! Breadcrumbs::render('sentences') !!}

  @include('sentences._header')
  <p>
    Studying attested phrases is a great way of learn Tolkien's languages.
    We currently have {{ $numberOfSentences }} phrases in our database, and
    {{ $numberOfNeologisms }} of them are neologisms.
  </p>
  <div class="row">
    <div class="col-sm-6">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h2 class="panel-title">Languages</h2>
        </div>
        <div class="panel-body">
          <ul>
          @foreach ($languages as $language)
            <li><a href="{{ $link->sentenceByLanguage($language->ID, $language->Name) }}">{{ $language->Name }}</a></li>
          @endforeach
          </ul>
        </div>
      </div>
    </div>
    <div class="col-sm-6">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h2 class="panel-title">Random phrase</h2>
        </div>
        <div class="panel-body">
          @include('sentences._random', [ 'sentence' => $randomSentence ])
        </div>
      </div>
    </div>
  </div>
@endsection