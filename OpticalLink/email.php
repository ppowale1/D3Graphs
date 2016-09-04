<?php
$action=$_REQUEST['action'];
if ($action=="")    /* display the contact form */
    {
        ?>
    <link rel="stylesheet" href="css/style.css">
    <h3>Please fill in as much information as possible:</h3><br>
    Basic Information
    <p>
    <form  action="" method="POST" enctype="multipart/form-data">
    Your email:
    <input name="email" type="text" value="" size="50"/><br><br>
    <input type="hidden" name="action" value="submit">
    Paper Title:
    <input name="title" type="text" value="" size="50"/><br><br>
    Authors (format: last1, first1, last2, first2):
    <input name="authors" type="text" value="" size="50"/><br><br>
    Journal/Conference:
    <input name="conference" type="text" value="" size="50"/><br><br>
    Year:
    <input name="year" type="text" value="" size="10"/><br><br>
    Affiliation:
    <input name="affiliation" type="text" value="" size="50"/><br><br>
    <div><div style="float: left;">Abstract:&nbsp;</div>
    <textarea name="abstract" rows="7" cols="50"></textarea></div><br>
    URL:
    <input name="url" type="text" value="" size="50"/><br><br><br>
    Design<br><br>
    Technology (Hybrid, VCSEL-based, etc.):
    <input name="Technology" type="text" value="" size="50"/><br><br>
    CMOS Node (130nm, 65nm, etc.):
    <input name="node" type="text" value="" size="50"/><br><br>
    Channel Type (Optical, Electrical):
    <input name="channel" type="text" value="" size="50"/><br><br>
    PD Capacitance (fF):
    <input name="pdcap" type="text" value="" size="50"/><br><br>
    Number of Channels (Lambda):
    <input name="Lambda" type="text" value="" size="50"/><br><br>
	Modulation Type (ON/OFF Keying, PAM-4, etc.):
    <input name="modulation" type="text" value="" size="50"/><br><br>
    Modulation Mode using (Ring - depletion mode, ring - carrier injection, etc.):
    <input name="modulationmode" type="text" value="" size="50"/><br><br>
    Total Data Rate of All Channels (Gbps):
    <input name="totalDR" type="text" value="" size="50"/><br><br>
    Data Rate Per Lane (Gbps):
    <input name="DRperLane" type="text" value="" size="50"/><br><br>
    TX Power Per Lane (mW):
    <input name="TxPower" type="text" value="" size="50"/><br><br>
    RX Power Per Lane (mW):
    <input name="RxPower" type="text" value="" size="50"/><br><br>
    Total Power Per Lane (mW):
    <input name="TotalPower" type="text" value="" size="50"/><br><br>
    TX E/B (fJ/b):
    <input name="TxEbyB" type="text" value="" size="50"/><br><br>
    RX E/B (fJ/b):
    <input name="RxEbyB" type="text" value="" size="50"/><br><br>
    Total E/B (fJ/b):
    <input name="TotalEbyB" type="text" value="" size="50"/><br><br>
    RX Sensitivity (uA):
    <input name="RxSensitivity" type="text" value="" size="50"/><br><br>
    PD Responsivity (A/W):
    <input name="PDResp" type="text" value="" size="50"/><br><br>
    Chip Area (mm^2):
    <input name="ChipArea" type="text" value="" size="50"/><br><br>
    <div><div style="float: left;">Other Information:&nbsp;</div>
    <textarea name="abstract" rows="7" cols="50"></textarea></div><br><br>
    </p>
    <p>
    <button style="padding:7px;background-color:#2980b9; border: none; color: #fefefe" type="submit">Submit Request</button>
    </form>
    <?php
    } 
else
{
	$name=$_REQUEST['name'];
    $email=$_REQUEST['email'];
    $title=$_REQUEST['title'];
    $authors=$_REQUEST['authors'];
    $conference=$_REQUEST['conference'];
    $year=$_REQUEST['year'];
    $affiliation=$_REQUEST['affiliation'];
    $abstract=$_REQUEST['abstract'];
    $Technology=$_REQUEST['Technology'];
    $node=$_REQUEST['node'];
    $channel=$_REQUEST['channel'];
    $pdcap=$_REQUEST['pdcap'];
    $Lambda=$_REQUEST['Lambda'];
    $modulation=$_REQUEST['modulation'];
    $modulationmode=$_REQUEST['modulationmode'];
    $totalDR=$_REQUEST['totalDR'];
    $DRperLane=$_REQUEST['DRperLane'];
    $TxPower=$_REQUEST['TxPower'];
    $RxPower=$_REQUEST['RxPower'];
    $TotalPower=$_REQUEST['TotalPower'];
    $TxEbyB=$_REQUEST['TxEbyB'];
    $RxEbyB=$_REQUEST['RxEbyB'];
    $TotalEbyB=$_REQUEST['TotalEbyB'];
    $RxSensitivity=$_REQUEST['RxSensitivity'];
    $PDResp=$_REQUEST['PDResp'];
    $ChipArea=$_REQUEST['ChipArea'];
    $Other=$_REQUEST['Other'];


	require 'PHPMailer-master/PHPMailerAutoload.php';

	$mail = new PHPMailer;

	$mail->isSMTP();                            // Set mailer to use SMTP
	$mail->Host = 'smtp.gmail.com';             // Specify main and backup SMTP servers
	$mail->SMTPAuth = true;                     // Enable SMTP authentication
	$mail->Username = 'opticallinksurvey@gmail.com';          // SMTP username
	$mail->Password = 'pallishna'; // SMTP password
	$mail->SMTPSecure = 'tls';                  // Enable TLS encryption, `ssl` also accepted
	$mail->Port = 587;                          // TCP port to connect to
	$mail->SMTPOptions = array(
	    'ssl' => array(
	        'verify_peer' => false,
	        'verify_peer_name' => false,
	        'allow_self_signed' => true
	    )
	);

	$mail->setFrom('opticallinksurvey@gmail.com', 'Optical Link Survey');
	$mail->addReplyTo('opticallinksurvey@gmail.com', 'Optical Link Survey');
	$mail->addAddress($email);   // Add a recipient
	$mail->addBCC('opticallinksurvey@gmail.com');
	//$mail->addCC('cc@example.com');
	//$mail->addBCC('bcc@example.com');

	$mail->isHTML(true);  // Set email format to HTML

	// Mail Body Content-----------------------------------------
	$bodyContent = 'The following request was made by: '.$email."<br>"."<br>";

	$bodyContent .= 'Title: '.$title."<br>";
	$bodyContent .= "Authors: ".$authors."<br>";
	$bodyContent .= "Journal/Conference: ".$conference."<br>";
	$bodyContent .= "Year: ".$year."<br>";
	$bodyContent .= "Affiliation: ".$affiliation."<br>";
	$bodyContent .= "Abstract: ".$abstract."<br>";
	$bodyContent .= "Technology: ".$Technology."<br>";
	$bodyContent .= "Node: ".$node."<br>";
	$bodyContent .= "Channel Type: ".$channel."<br>";
	$bodyContent .= "PD Capacitance (fF): ".$pdcap."<br>";
	$bodyContent .= "Number of Channels (Lambda): ".$Lambda."<br>";
	$bodyContent .= "Modulation Type: ".$modulation."<br>";
	$bodyContent .= "Modulation Mode Using: : ".$modulationmode."<br>";
	$bodyContent .= "Total DR: ".$totalDR."<br>";
	$bodyContent .= "Data Rate per Lane: ".$DRperLane."<br>";
	$bodyContent .= "TX Power Per Lane (mW): ".$TxPower."<br>";
	$bodyContent .= "RX Power Per Lane (mW): ".$RxPower."<br>";
	$bodyContent .= "Total Power Per Lane (mW): ".$TotalPower."<br>";
	$bodyContent .= "TX E/B (fJ/b): ".$TxEbyB."<br>";
	$bodyContent .= "RX E/B (fJ/b): ".$RxEbyB."<br>";
	$bodyContent .= "Total E/B (fJ/b): ".$TotalEbyB."<br>";
	$bodyContent .= "RX Sensitivity (uA): ".$RxSensitivity."<br>";
	$bodyContent .= "PD Responsivity (A/W): ".$PDResp."<br>";
	$bodyContent .= "Chip Area (mm^2): ".$ChipArea."<br>";
	$bodyContent .= "Other information: ".$Other."<br>"."<br>";
	$bodyContent .= "Thank you for your request. Please expect an update within 2 business days.";


	// Mail Body Content-----------------------------------------
	$mail->Subject = 'Thank you for your request to the Optical Link Survey';
	$mail->Body    = $bodyContent;
	if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
		$message = "Please enter valid email address";
		echo "<script type='text/javascript'>alert('$message');</script>";
	}
	else if(!$mail->send()) {
	    $message = 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo;
		echo "<script type='text/javascript'>alert('$message');</script>";
	} else {
		$message = "Your request has been submitted. Please allow 2 business days for us to get back to you. Thank you.";
		echo "<script type='text/javascript'>alert('$message');</script>";
		echo "<script>window.location = 'index.html';</script>";
	}
}
?>