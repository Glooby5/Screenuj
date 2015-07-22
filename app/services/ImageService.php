<?php
namespace Screenuj\Services;

use Screenuj\Entities\Image;

/**
 * Description of ImageService
 *
 * @author Jan Kadeřábek <kaderabek.jan@gmail.com>
 */
class ImageService extends BaseService
{
    /**
     * @return string
     */
    protected function getEntityClassName()
    {
        return Image::getClassName();
    }
}