<?php
namespace App\Presenters;

use Nette\Application\BadRequestException;
use Nette\Application\Responses\JsonResponse;
use Screenuj\Model\ImageStorage;
use Screenuj\Services\ImageService;

class UploadedPresenter extends BasePresenter
{    
    /** @var ImageService */
    public $imageService;
    
    /** @var ImageStorage */
    public $imageStorage;
    
    public function __construct(ImageService $imageService, ImageStorage $imageStorage)
    {
        parent::__construct();
        $this->imageService = $imageService;
        $this->imageStorage = $imageStorage;
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

    public function handleDelete($code)
    {
        if (!$this->user->isLoggedIn())
            $this->sendResponse(new JsonResponse(['status' => 'error', 'type' => 'unauthorized', 'message' => 'Nepřihlášený uživatel']));
        
        try
        {
            $this->imageStorage->Delete($code, $this->user->id);
        } 
        catch (\Exception $ex) 
        {
            $this->sendResponse(new JsonResponse(['status' => 'error', 'type' => 'unknown', 'message' => $ex->getMessage()]));
        }

        $this->sendResponse(new JsonResponse(['status' => 'success']));        
    }
}
