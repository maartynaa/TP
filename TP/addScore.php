<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "login";

$conn = new mysqli($servername, $username, $password, $dbname);

$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata)) {
	$request = json_decode($postdata);
	
	
	$username = mysqli_real_escape_string($conn, trim($request->UserName));
	$score = mysqli_real_escape_string($conn, trim($request->Score));

	
	$sql = "INSERT INTO `ranking`(`username`, `score`) 
	VALUES ('{$username}','{$score}')";
	
	if(mysqli_query($conn, $sql)){
		http_response_code(201);
		echo json_encode(
					array(
						"Succeeded" => true
					));
	}
	else {
		http_response_code(201);
		echo json_encode(
					array(
						"Succeeded" => false
					));
	}
}

?>