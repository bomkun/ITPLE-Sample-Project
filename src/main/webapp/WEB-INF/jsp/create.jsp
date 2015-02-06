<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>ITPLE Sample Project REST Example</title>
	
	<script type="text/javascript" src="${contextPath}/resources/js/lib/jquery-1.8.0.js"></script>
	<script type="text/javascript" src="${contextPath}/resources/js/lib/jquery-ui-1.11.1/jquery-ui.js"></script>
	<script type="text/javascript" src="${contextPath}/resources/js/lib/jui/jui.min.js"></script>

	<script type="text/javascript" src="${contextPath}/resources/js/lib/jui/jui.js"></script>	
	<link rel="stylesheet" type="text/css" href="${contextPath}/resources/js/lib/jui/jui.min.css">
	
	<link rel="stylesheet" href="//code.jquery.com/ui/1.8.24/themes/base/jquery-ui.css">
	
	
	
</head>
<body class="jui">

	<center>
		<b>Being Java | Registration Form</b>
		
		<a class="btn btn-gray btn-small" href="${contextPath}/"><i class="icon-home icon-purple" style="font-size: 18px;"></i></a>
		
	<div id="contents_info">
		<form name="form" id="form">
		<br>
		<table>
			<tr>
				<th>Name :</th>
				<td>
				<input type="text" class="input input-mini input-black" id="name">
				</td>
			</tr>
			<tr>
				<th>Gender :</th>
				<td>		
				<div id="btn_radio_1" class="group">
					<a class="btn btn-small btn-gray-purple" name="radio_btn" id="radio1" value="male">Male</a>
					<a class="btn btn-small btn-gray-purple" name="radio_btn" id="radio2" value="female">Female</a>
				</div>
				<div id="radio">
  					<input type="radio" id="radio1" name="radio" value="choice1"><label for="radio1">Choice 1</label>
  					<input type="radio" id="radio2" name="radio" value="choice2"><label for="radio2">Choice 2</label>
				</div>
				<input type ="radio" name="test" value="y">a
				<input type ="radio" name="test" value="n">b
				<input type ="radio" name="test" value="z">c
				
				</td>
			</tr>
			<tr>
				<th>Email :</th>
				<td>
				<input type="text" id="email" class="input input-mini input-black">
				</td>
			</tr>			
			<tr>
				<th>Phone :</th>
				<td>
				<input type="text" id="phone" class="input input-mini input-black" maxlength="13">
				</td>
			</tr>			
			<tr>
				<th>City :</th>
				<td>
				<div id="combo_1" id ="city" class="combo">
					<a class="btn btn-gray">Select...</a>
					<a class="btn btn-gray btn-toggle"><i class="icon-arrow2"></i></a>				
					<ul style="width: 150px">
						<li value="0">---select---</li>
						<li value="1">Delhi</li>
						<li value="2">Guragon</li>
						<li value="3">aderkagon</li>
						<li value="4">Others</li>
					</ul>
				</div>
				</td>
			</tr>

		</table>
		</form>
		
	<p>
	<a class="btn btn-large btn-purple" id="submit_btn" onclick="doSubmit()">save</a>
	<a class="btn btn-large btn-gray">reset</a>
</p>
	
	</div>		
	</center>
</body>
</html>

<script type="text/javascript">
	
$(document).ready(function(){
	
	$( "#radio" ).buttonset();
	
	jui.ready([ "ui.button" ], function(button) {
	var btn_radio_options = {
		type: "radio",
		event: {
			change: function(data) {
				console.log(data.value)
			}
		}
	};
	
	btn_radio_1 = button("#btn_radio_1", btn_radio_options);
	btn_radio_2 = button("#btn_radio_2", btn_radio_options);
	btn_radio_3 = button("#btn_radio_3", btn_radio_options);
});
	
	jui.ready([ "ui.combo" ], function(combo) {
		combo_1 = combo("#combo_1", {
			index: 0,
			position: "bottom",
		});
	});	
	
});	


function doSubmit() {
	
	var name = $("#name").val();
	var gender = $('input:radio[name=radio]:checked').val();
	var test = $("input:radio[name=test]:checked").val();
	var email = $("#email").val();
	var phone = $("#phone").val();
	var city = $("#city").val();
	
	console.log(name);
	console.log(gender);
	console.log(test);
	console.log(email);
	console.log(phone);
	console.log(city);
	
}
	
</script>
	
