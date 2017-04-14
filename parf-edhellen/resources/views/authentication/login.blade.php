@inject('link', 'App\Helpers\LinkHelper')
@extends('_layouts.default')

@section('title', 'Logging in')

@section('body')
  <h1>Logging in</h1>
  <p>
    Greetings traveller! Would you like to join our community? You are more than welcome to do!
  </p>
  <p>
    We believe in protecting your privacy, so we have decided against storing user names and passwords.
    Instead, we rely on third party identity providers to assert your identity. It works a bit like a
    passport, where your country provides the identity!
  </p>

  <ul>
    @foreach ($providers as $provider)
    <li><a href="{{ $link->authRedirect($provider->URL) }}">{{ $provider->Name }}</a></li>
    @endforeach
  </ul>
@endsection
