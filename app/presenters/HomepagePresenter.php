<?php

namespace App\Presenters;

use Nette\Application\BadRequestException;
use Screenuj\Model\ImageStorage;
use Screenuj\Services\ImageService;


/**
 * Homepage presenter.
 */
class HomepagePresenter extends BasePresenter
{
    private $imageService;
    private $imageStorage;
    
    public function __construct(ImageService $imageService, ImageStorage $imageStorage) 
    {
        parent::__construct();
        $this->imageService = $imageService;
        $this->imageStorage = $imageStorage;
                
    }
    
    public function renderDefault($code)
    {
        
    }


    public function renderDetail($code)
    {
        $image = $this->imageService->findOneBy(['link.code' => $code]);
        
        if (!$image)
        {
            throw new BadRequestException("Neexistující kód obrázku", 404);
        }       
        $images = $this->imageService->getByUserID($this->user->id);
        
        $this->template->image = $images[0];
        $this->template->source = $this->imageStorage->LoadImage($image);        
        //$this->template->setFile(__DIR__ .'\templates\Homepage\detail.latte');

    }
}
