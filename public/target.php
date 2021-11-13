<?php
if(isset($_POST['beschreibung'])) {
    $id = rand(1 ,10000000);
    $nicknamecheck = '';
    if( $_POST['nickname'] == ''){
        $nicknamecheck = 'unbekannt';
    }else{
        $nicknamecheck = $_POST['nickname'];
    }

    $data = '["' . $_POST['beschreibung'] . '"' . ',' . $_POST['lat']. ',' . $_POST['long'] . ',' . '"' . date("h:i:sa") . '"' .  ',' .  $id .  ',' . '"  &#128102; von ' .  $nicknamecheck . '"' . '],' ."\r\n";
    $ret = file_put_contents('mydata.txt', $data, FILE_APPEND | LOCK_EX);
    if($ret === false) {
        die('There was an error writing this file');
    }
    else {
        echo "<html><body style='margin:0;background-color:#4CAF50;'>
                <center>
                <h1 style='color:white;margin-top:25vh;'>Position gespeichert! Sie wird bald auf der Karte sein.<br>Dankeschön &#10084;</h1>
                <a style="font-size:30px" href='add.html'>Hier geht's zurück</a>
                </center>
           </body></html>";
    }
}
else {
   die('no post data to process');
}
