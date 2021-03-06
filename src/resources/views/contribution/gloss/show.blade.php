@inject('link', 'App\Helpers\LinkHelper')
@extends('_layouts.default')

@section('title', 'Contribute')
@section('body')
  <h1>Contribution #{{ $review->id }}</h1>
  
  {!! Breadcrumbs::render('contribution.show', $review->id, $admin) !!}

  @include('contribution._status-alert', $review)

  @if ($parentGloss)
  <p>
    <span class="glyphicon glyphicon-info-sign"></span>
    This is a proposed modification of the gloss <a href="{{ $link->gloss($parentGloss) }}">{{ $parentGloss }}</a>.
  </p>
  @endif

  <div class="well">
    @foreach ($sections as $section)
      @foreach ($section['glosses'] as $gloss)
        @include('book._gloss', [ 
          'gloss' => $gloss, 
          'language' => $section['language'],
          'disable_tools' => true
        ])
      @endforeach
      <span class="label label-default">{{ $section['language']['name'] }}</span>
    @endforeach

    @foreach ($keywords as $keyword) 
      <span class="label label-default">{{ $keyword }}</span>
    @endforeach
  </div>
  
  @include('contribution._notes', $review)

  @if (! $review->is_approved)
    @include('contribution._pending-info', $review)
  @else
  <hr>
  You can <a href="{{ $link->gloss($review->gloss_id) }}">visit the gloss in the dictionary</a>.
  @endif
  <hr>
  @include('_shared._comments', [
    'entity_id' => $review->id,
    'morph'     => 'contribution',
    'enabled'   => true
  ])

@endsection

@section('scripts')
  <script type="text/javascript" src="@assetpath(/js/comment.js)" async></script>
@endsection
