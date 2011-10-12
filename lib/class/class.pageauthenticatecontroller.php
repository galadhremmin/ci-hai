<?php
  if (!defined('SYS_ACTIVE')) {
    exit;
  }
  
  class PageAuthenticateController extends Controller {
    public function __construct(TemplateEngine &$engine) {
      parent::__construct('authenticate');
      
      $error = null;
      
      try {
        // Initialize the OpenID authentication class
        $provider = new LightOpenID('elfdict.com');
        
        // Upon class initialization, it's acquiring a variety
        // of modes. Use these do determine subsequent behaviour.
        if (!$provider->mode) {
          // User is not logged in & has requrest to authenticate
          if (isset($_GET['authenticate'])) {
            // Make sure that the requested provider is correctly formatted.
            if (!isset($_POST['provider']) || !is_numeric($_POST['provider'])) {
              throw new ErrorException('Missing provider.');
            }
            
            $providerID = $_POST['provider'];
            if ($this->_model === null) {
              throw new ErrorException('No providers available.');
            }
            
            $providers = $this->_model->getProviders();
            if (!isset($providers[$providerID])) {
              throw new ErrorException('Unrecognised provider.');
            }
          
            // Assign the provider URL as the discovery URL.
            $provider->identity = $providers[$providerID]->URL;
            
            // relocate to the identity provider
            header('Location: ' . $provider->authUrl());
          }
        } else if ($provider->mode === 'cancel') {
          // user cancelled authentication
          $error = 'User has canceled authentication!';
        } else {
          // user is authenticated
          if (Session::register($provider)) {
            // authentication success!
            header('Location: profile.page');
          } else {
            $error = 'Unfortunately, authentication seems to have failed.';
          }
        }
      } catch(ErrorException $e) {
        $error = $e->getMessage();
      }

      if ($this->_model !== null) {
        $engine->assign('providers', $this->_model->getProviders());
      }
      $engine->assign('errorMessage', $error);
    }
  }
?>