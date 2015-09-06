<?php
namespace App\Presenters;

use Nette\Application\BadRequestException;
use Screenuj\Services\ImageService;
use function dump;

class UploadedPresenter extends BasePresenter
{    
    /** @var ImageService */
    public $imageService;
    
    public function __construct(ImageService $imageService)
    {
        parent::__construct();
        $this->imageService = $imageService;
    }
    
    public function renderDefault()
    {
        if ($this->user->isLoggedIn())
        {
            $images = $this->imageService->getByUserID($this->user->id);
            $this->template->images = $images;
        }
        else 
        {
            throw new BadRequestException("Pouze pro přihlášené uživatele!", 401);
        }
    }

}
