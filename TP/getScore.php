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
	
	echo "aaa";
	echo json_encode(
				array(
					"message" => "Successful",
										
				));
	
	$sql = "SELECT * FROM `ranking`";
	$result = mysqli_query($conn, $sql);

	
	if ($result ->num_rows > 0) {
		echo "bbbbb";
		echo json_encode(
				array(
					"message" => "Successful",
										
				));
		http_response_code(200);
	
	}
	
}

?>