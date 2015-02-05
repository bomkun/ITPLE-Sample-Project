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
	<script type="text/javascript" src="${contextPath}/resources/js/lib/jui/js/ui/button.js"></script>
	<script type="text/javascript" src="${contextPath}/resources/js/lib/jui/js/ui/combo.js"></script>
	
	<link rel="stylesheet" type="text/css" href="${contextPath}/resources/js/lib/jui/jui.min.css">
	
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
					<a class="btn btn-small btn-gray-purple" id="radio" value="male">Male</a>
					<a class="btn btn-small btn-gray-purple" id="radio" value="female">Female</a>
				</div>
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
	
	
	function doSubmit() {
		
		var name = $("#name").val();
		var gender = $("#btn_radio_1").val();
		var email = $("#email").val();
		var phone = $("#phone").val();
		var city = $("#city").val();
		
		console.log(name);
		console.log(gender);
		console.log(email);
		console.log(phone);
		console.log(city);
		
	}
	
</script>
	
