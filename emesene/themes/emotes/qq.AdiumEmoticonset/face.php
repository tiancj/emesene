<?php
 for ($i=0;$i<105;$i++)
{
    $a = file_get_contents("http://0.web.qstatic.com/webqqpic/style/face/{$i}.gif");
    file_put_contents("{$i}.gif",$a);
}
?>
