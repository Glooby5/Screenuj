<?php
namespace Screenuj\Model;

use Latte\Compiler;
use Latte\MacroNode;
use Latte\Macros\MacroSet;
use Latte\PhpWriter;

class MyMacros extends MacroSet
{
    public static function install(Compiler $compiler)
    {
        $me = new static($compiler);
        $me->addMacro('thumbLoad', array($me, 'macroThumbLoad'));            
    }
    
    public function macroThumbLoad(MacroNode $node, PhpWriter $writer)
    {
        //dump($node);
        return 'echo Screenuj\Model\ImageStorage::LoadThumbUrl($image)';
    }
}
