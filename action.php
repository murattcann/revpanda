<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    $db = new PDO("mysql:host=localhost;dbname=revpanda", "root", "");
} catch ( PDOException $e ){
    print $e->getMessage();
}
 
const GET_ACTION = "getItems";
const SAVE_ACTION = "saveItem";
 
if(isset($_POST["action"]) && $_POST["action"] === "getItems"){
    
    $table = $_POST["table"]. "_table";
    $orderColumn = $_POST["orderColumn"] ?? "id";
    $orderDirection = $_POST["orderDirection"] ?? "DESC";
    
    $tableValues = $db->query("SELECT * FROM " . $table. " ORDER BY {$orderColumn} {$orderDirection}" , PDO::FETCH_ASSOC)->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(["rows" => $tableValues, "rowCount" => count($tableValues)]);
}


if(isset($_POST["action"]) && $_POST["action"] === SAVE_ACTION){
    
    $table = $_POST["table"]. "_table";
    $value = $_POST["tableValue"];
   
    $execute = $db->prepare("INSERT INTO {$table}(table_value) VALUES(?)");
    $execute->bindParam(1, $value);

    $save = $execute->execute();

    $statusCode = $save ?  201: 400;
    
    echo json_encode(["status" => $statusCode]);
}
?>