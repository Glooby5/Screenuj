<?php

namespace App\Presenters;

use Screenuj\Services\UserService;
use Screenuj\Entities;

/**
 * Presenter for log in from Facebook, Google, ...
 */
class SignPresenter extends BasePresenter
{
    /** @inject @var UserService */
    public $userService;
    
    public function __construct(UserService $userService)
    {
        parent::__construct();
        $this->userService = $userService;
    }
    
    public function handleFacebook($fbId, $name, $email, $token)
    {
        //@todo: přidání do databáze a vytvoření identity
        $user = $this->userService->findOneBy(['facebook' => $fbId]);
        
        if (!$user) //Neexistuje uživatel se zadaným FB ID
        {
            $user = $this->userService->findOneBy(['email' => $email]);
            
            if (!$user) //Neexistuje uživatel se stejným emailem
            {
                $user = new Entities\User($name, $email, $fbId);
                $this->userService->save($user);    
                
            } 
            else 
            {
                /** @todo Sloučit účty */
            }
        }
        $data = ['email' => $user->email, 'name' => $user->name, 'type' => 'Facebook', 'signed' => new \DateTime()];          
        $identity = new \Nette\Security\Identity($user->id, NULL, $data);
        
        $this->flashMessage('You have been signed in.');
        $this->user->login($identity);
        $this->template->user = $this->user;
        $this->redrawControl("loginSnippet");
    }
    
    public function handleOut()
    {
        $this->getUser()->logout();
        $this->flashMessage('You have been signed out.');
        
        $this->template->user = $this->user;
        $this->redrawControl("loginSnippet");
    }
    
}
