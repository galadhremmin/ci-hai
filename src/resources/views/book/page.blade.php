@extends('_layouts.default')

@section('title', $word)

@section('body')
<div class="ed-remove-when-navigating">
  @include('book._page', $sections)
</div>
@endsection