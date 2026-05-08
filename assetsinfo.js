var viewerButton = { show: true, size: 'large' };
var viewerOptions = {
	url: 'data-src',
	title: false,
	toolbar: {
		'prev': viewerButton,
		'zoom-in': viewerButton,
		'zoom-out': viewerButton,
		'rotateLeft': viewerButton,
		'rotateRight': viewerButton,
		'oneToOne': viewerButton,
		'reset': viewerButton,
		'next': viewerButton,
	},
	hidden: function (e) {
		e.stopPropagation();
	}
};
var cdnUrl = window.localStorage.getItem('cdnUrl');

jQuery(document).ready(function () {

	//#region actions show hide logic
	var assetData = JSON.parse(userRoleMenu).find(x => x.name == "Asset List");
	var driverConfigJson = localStorage.driverConfig ? JSON.parse(localStorage.driverConfig) : null;
	var componentsData = [];
	if (assetData && assetData.components && assetData.components.length > 0) {
		assetData.components.forEach(function (data) {
			if (data.show == "true") {
				componentsData.push(data.name);
			}
		})
	}
	$('.btn-xs.i_edit').hide();
	if (assetData && assetData.actions.edit == "true") {
		$('.btn-xs.i_edit').show();
	}
	$('#addNew, #uploadDocuments, #asset_info_share_new').hide();
	if (assetData && assetData.actions.add == "true") {
		$('#addNew, #uploadDocuments, #asset_info_share_new').show();
	}
	$('.showOdo').hide();
	if (localStorage.AccountId == 3634) {
		$('.showOdo').show();
	}
	//#endregion

	$("#dueDate").datetimepicker({
		format: "YYYY-MM-DD"
	});

	let scope = this;
	//cdnUrl
	var cdnUrl = window.localStorage.getItem('cdnUrl');

	// editable table for share asset
	EditableTable.init();

	//$('.sparkline').sparkline([4.2,4.1,4.6,4.9,4.2,4.1,4,4.3,4.5],{ type:'bar', barColor:'orange',chartRangeMin:0,height:50 });
	if (location.hash != "") {
		$(`#assetinfo_tab a[href="${location.hash}"]`).tab('show');
	}

	if (localStorage.userType != "Admin") {
		$("#info .btn.btn-primary").hide()
	}

	$(".fuel").select2({
		theme: "classic",
		placeholder: "Type",
		allowClear: true,
		templateResult: formatSelect2,
		data: ['IOCL', 'BPCL', 'HPCL', 'Reliance', 'Shell', 'Essar', 'KTT']
	});

	function formatSelect2(option) {
		if (!option.id) { return option.text; }
		var $option = $(
			'<span ><img width="20px;" src="/images/cards/' + option.element.value.toLowerCase() + '.png" /> ' + option.text + '</span>'
		);
		return $option;
	}

	//asset info
	$('#infoEntryForm').validate({
		submitHandler: function (form) {

			$('#saveInfoEntryBtn').prop('disabled', true);

			$.ajax({
				type: $(form).attr('method'),
				url: path + $(form).attr('action'),
				data: $(form).serialize(),
				headers: { 'X-AT-SessionToken': localStorage.sessionToken }
			}).done(function (response) {
				if (response.success === true) {
					location.reload();
				} else {
					alert(response.message);
				}
				$('#saveInfoEntryBtn').prop('disabled', false);
			});

			return false;
		}
	});

	//#weight input box automatic calc
	$('#unladenweight,#oldgrossweight,#grossweight').on('blur', function () {
		if ($(this).val() >= 0 && $(this).val() <= 100) {
			var wtCalac = Number($(this).val()) * 1000;
			$(this).val(wtCalac);
		}
	});

	$('.i_edit').on('click', function (e) {
		e.preventDefault();

		$.ajax({
			type: 'GET',
			url: path + '/api/assets/' + window.location.pathname.split('/')[2],
			headers: { 'X-AT-SessionToken': localStorage.sessionToken }
		}).done(function (response) {
			if (response.success === true) {
				$('#AssetId').val(response.asset.id);
				$('#lplate').val(response.asset.lplate);
				$('#assetCode').val(response.asset.assetCode);
				$('#chassisNo').val(response.asset.chassisNo);
				$('#engineNo').val(response.asset.engineNo);
				$('#vehicleModel').val(response.asset.VehicleModelId).trigger('change');
				$('#mfgMonth').val(response.asset.mfgMonth).trigger('change');
				$('#mfgYear').val(response.asset.mfgYear).trigger('change');
				$('#ownerName').val(response.asset.ownerName).trigger('change');
				$('#address').val(response.asset.address);
				$('#expMileage').val(response.asset.expMileage);
				$('#expMileageUom').val(response.asset.expMileageUom).trigger('change');
				$('#fTankCapacity').val(response.asset.fTankCapacity);
				$('#fTankCapacity2').val(response.asset.fTankCapacity2);
				$('#sCapacity').val(response.asset.sCapacity);
				$('#avgKM').val(response.asset.avgKM);
				$('#avgHrs').val(response.asset.avgHrs);
				$('#pLocation').val(response.asset.pLocation);
				$('#rtoLocation').val(response.asset.rtoLocation);
				$('#note').val(response.asset.note);
				$('#axleProfile').val(response.asset.axleProfile).trigger('change');
				$('#unladenweight').val(response.asset.unladenweight);
				$('#oldgrossweight').val(response.asset.oldgrossweight);
				$('#grossweight').val(response.asset.grossweight);
				$('#vType').val(response.asset.VehicleTypeId).trigger('change');
				if (response.asset.cards && response.asset.cards.fuel && response.asset.cards.fuel.length > 0) {
					var fuelObject = response.asset.cards.fuel[0];
					var fuelKey = Object.keys(response.asset.cards.fuel[0]);
					$('#fuelType1').val(fuelKey[0] ? fuelKey[0] : "").trigger('change');
					$('#fuelNo1').val(fuelObject[fuelKey[0]] ? fuelObject[fuelKey[0]] : "");

					$('#fuelType2').val(fuelKey[1] ? fuelKey[1] : "").trigger('change');
					$('#fuelNo2').val(fuelObject[fuelKey[1]] ? fuelObject[fuelKey[1]] : "");

					$('#fuelType3').val(fuelKey[2] ? fuelKey[2] : "").trigger('change');
					$('#fuelNo3').val(fuelObject[fuelKey[2]] ? fuelObject[fuelKey[2]] : "");

				}
				if (response.asset.cards && response.asset.cards.atm && response.asset.cards.atm.length > 0) {
					var key = Object.keys(response.asset.cards.atm[0]);
					$('#atmType').val(key);
					$('#atmCardNo').val(response.asset.cards.atm[0][key]);
				}
				if (response.asset.cards && response.asset.cards.fastag && response.asset.cards.fastag.length > 0) {
					$('#fastTag').val(response.asset.cards.fastag);
				}
				$("#hierarchyEdit").val(response.asset.hierarchyIds).trigger("change");
				$('#infoEntryModal').modal('show');
			} else {
				alert(response.message);
			}
		});
	});

	//driver list
	$.ajax({
		dataType: "json",
		url: path + "/api/Drivers/asset/" + window.location.pathname.split('/')[2],
		headers: { 'X-AT-SessionToken': localStorage.sessionToken },
		success: function (json) {
			if (json.success === true) {
				var employeeDetails = $('#employeeDetails tbody');
				for (var i = json.results.length - 1; i >= 0; i--) {
					var eType = "Driver";
					if (json.results[i].type == 2) {
						eType = "Attender";
					} else if (json.results[i].type == 3) {
						eType = "Conductor";
					} else if (json.results[i].type == 4) {
						eType = "Cleaner";
					} else if (json.results[i].type == 5) {
						eType = "Operator";
					} else if (json.results[i].type == 6) {
						eType = "Site Supervisor";
					} else if (json.results[i].type == 7) {
						eType = "Helper";
					} else if (json.results[i].type == 8) {
						eType = "Manager";
					} else if (json.results[i].type == 11) {
						eType = "Driver Trainer";
					} else if (json.results[i].type == 10) {
						eType = "Local Driver";
					} else if (json.results[i].type == 9) {
						eType = "Second Driver";
					}
					if (driverConfigJson && driverConfigJson.customDriverType && driverConfigJson.customDriverType == true && json.results[i].type == 1) {
						eType = "First Driver";
					}

					var dlNo = json.results[i].dlno ? json.results[i].dlno : 'N/A';
					var body = '<tr><th style="width:220px">' + eType + '</th><td>' + json.results[i].name + ' (' + dlNo + ')' + '</td>';
					body += '<td>' + json.results[i].phone1 ? json.results[i].phone1 : '';
					if (json.results[i].phone2 != '') {
						body += '<br>' + json.results[i].phone2 ? json.results[i].phone2 : '';
					}
					if (json.results[i].phone3 != '') {
						body += '<br>' + json.results[i].phone3 ? json.results[i].phone3 : '';
					}
					body += '</td></tr>'
					employeeDetails.append(body);
				}
			} else {
				alert("Cant load driver list. Please try again later.");
			}
		}
	});


	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: path + '/api/groups/list',
		headers: { 'X-AT-SessionToken': localStorage.sessionToken },
		success: function (json) {
			if (json.success === true) {
				//remove empty and null
				json.results = json.results.filter(function (el) {
					return el.id ? el : false;
				});
				json.results = json.results.map(function (obj) {
					if (!obj.id) return null;
					var rObj = {};
					rObj.id = obj.id;
					rObj.text = obj.name;
					return rObj;
				});

				json.results.unshift({ id: '', text: 'Select Group' });

				$('.group-select2').select2({
					theme: 'classic',
					placeholder: 'Select a Group',
					allowClear: true,
					data: json.results
				});
			} else {
				alert("Can't load Group. Please try again later.");
			}
		}
	});

	$.ajax({
		dataType: "json",
		url: path + "/api/assets/list/axleProfiles",
		headers: { 'X-AT-SessionToken': localStorage.sessionToken },
		success: function (json) {
			if (json.success === true) {
				$("#axleProfile").select2({
					theme: "classic",
					placeholder: "Select an axle profile",
					allowClear: true,
					data: json.results,
				});
			} else {
				alert("Failed to load axle profiles. Please try again later.");
			}
		}
	});

	$.ajax({
		dataType: "json",
		url: path + "/api/serviceschedules/vehiclemodels",
		headers: { 'X-AT-SessionToken': localStorage.sessionToken },
		success: function (json) {
			if (json.success === true) {
				scope.vehicleModelAxleInfo = json.results.map(function (obj) {
					var rObj = {};
					rObj.id = obj.id;
					rObj.axle = obj.defaultAxle;
					return rObj;
				});

				var vehicleModels = json.results.map(function (obj) {
					var rObj = {};
					rObj.id = obj.id;
					rObj.text = (!obj.VehicleBrand.brandName ? '' : obj.VehicleBrand.brandName) + ' ' + (!obj.modelName ? '' : obj.modelName);
					return rObj;
				});

				$("#vehicleModel").select2({
					theme: "classic",
					placeholder: "Select a model",
					allowClear: true,
					data: vehicleModels,
				});

				$('#vehicleModel')
					.on('select2:select', function (e) {
						var modelInfo = scope.vehicleModelAxleInfo.find(x => x.id == $(e.currentTarget).val())
						$('#axleProfile').val(modelInfo.axle).trigger('change');
					})
					.on('select2:unselect', function (e) {
						$('#axleProfile').val('').trigger('change');
					});

				var makeMonth = [
					{ id: 1, text: "January" },
					{ id: 2, text: "February" },
					{ id: 3, text: "March" },
					{ id: 4, text: "April" },
					{ id: 5, text: "May" },
					{ id: 6, text: "June" },
					{ id: 7, text: "July" },
					{ id: 8, text: "August" },
					{ id: 9, text: "September" },
					{ id: 10, text: "October" },
					{ id: 11, text: "November" },
					{ id: 12, text: "December" }
				];

				var mfgYear = []; var date = new Date();
				for (i = date.getFullYear(); 1950 <= i; i--) {
					mfgYear.push({
						id: i,
						text: i
					})
				}

				$("#mfgMonth").select2({
					theme: "classic",
					placeholder: "Month",
					allowClear: true,
					data: makeMonth,
				});

				$("#mfgYear").select2({
					theme: "classic",
					placeholder: "Year",
					allowClear: true,
					data: mfgYear,
				});

				$("#expMileageUom").select2({
					theme: "classic",
					placeholder: "UOM",
					allowClear: true,
					data: ["KMPL", "LPH"]
				});
			} else {
				alert("Failed to load vehicle models. Please try again later.");
			}
		}
	});

	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: path + '/api/assets/list',
		headers: { 'X-AT-SessionToken': localStorage.sessionToken },
		success: function (json) {
			if (json.success === true) {

				scope.ownerAddressInfo = json.results.filter(x => {
					return x.ownerName && x.address
				}).map(function (obj) {
					var rObj = {};
					rObj.owner = obj.ownerName;
					rObj.address = obj.address;
					return rObj;
				});

				var owners = json.results.filter(x => {
					return x.ownerName
				}).map(function (obj) {
					var rObj = {};
					rObj.id = obj.ownerName;
					rObj.text = obj.ownerName;
					return rObj;
				});

				$('#ownerName').select2({
					theme: 'classic',
					placeholder: 'Select owner',
					allowClear: true,
					tags: true,
					data: Object.values(owners.reduce((r, o) => (r[o.id] = o, r), {}))
				});

				scope.odo = Math.round(json.results.find(x => x.id == window.location.pathname.split('/')[2]).odo / 1000);
				scope.ehr = Math.floor(json.results.find(x => x.id == window.location.pathname.split('/')[2]).engineHrs / 60);

				$('#ownerName')
					.on('select2:select', function (e) {
						var ownerInfo = scope.ownerAddressInfo.find(x => x.owner == $(e.currentTarget).val())
						if (ownerInfo) {
							$('#address').val(ownerInfo.address)
						}
					})
					.on('select2:unselect', function (e) {
						$('#address').val('')
					});

			} else {
				alert("Can't load owner info. Please try again later.");
			}
		}
	});

	$.ajax({
		dataType: "json",
		url: path + "/api/serviceschedules/vehicletypes",
		headers: { 'X-AT-SessionToken': localStorage.sessionToken },
		success: function (json) {
			if (json.success === true) {

				var bodyTypes = json.results.map(function (obj) {
					var rObj = {};
					rObj.id = obj.id;
					rObj.text = (obj.type ? obj.type : 'N/A') + (obj.variant ? ' ' + obj.variant : '');
					return rObj;
				});

				$("#vType").select2({
					theme: "classic",
					placeholder: "Select a body type",
					allowClear: true,
					data: bodyTypes,
				});

			} else {
				alert("Failed to load body types. Please try again later.");
			}
		}
	});

	$("#sTime, #inTime, #outTime, #fTime, #transactionTime").datetimepicker({
		format: "DD/MM/YYYY hh:mm A",
		sideBySide: true
	});

	$('#fuelEntryModal').on('shown.bs.modal', function () {
		var currentTime = moment();
		$("#fTime").data("DateTimePicker").maxDate(currentTime);
		$("#fTime").data("DateTimePicker").defaultDate(currentTime);
	});

	$("#liters,#fuelEntryForm #amount,#pricePerLiter").on("change", function () {
		if ($(this).attr('id') == 'amount' && ($("#pricePerLiter").val() == "0" || $("#pricePerLiter").val() == "")) {
			var pricePerLiter = $("#fuelEntryForm #amount").val() / $("#liters").val();
			$("#pricePerLiter").val(Math.round(pricePerLiter * 100) / 100);
		} else {
			var amount = $("#pricePerLiter").val() * $("#liters").val();
			$("#fuelEntryForm #amount").val(Math.round(amount * 100) / 100);
		}
	});

	$('#fuelEntryTable').on('click', '.delete', function (e) {
		e.preventDefault();
		if (!confirm("Are you sure to delete this record?")) {
			return;
		}
		var ele = $(this);
		var id = ele.data('id');
		$.ajax({
			type: 'DELETE',
			url: path + '/api/fuellogs/' + id,
			headers: { 'X-AT-SessionToken': localStorage.sessionToken }
		}).done(function (response) {
			if (response.success === true) {
				if (response.reload != undefined && response.reload === true) {
					//reloadFuleLogTable();
					fuelEntryTable.ajax.reload();
				} else {
					//ele.closest('tr').remove();
					fuelEntryTable
						.row(ele.closest('tr'))
						.remove()
						.draw();
				}
			} else {
				alert('Cannot delete now. Please try again later.');
			}
		});
	});

	$('#fuelEntryTable').on('click', '.edit', function (e) {
		e.preventDefault();
		var ele = $(this);
		var id = ele.data('id');
		$.ajax({
			type: 'GET',
			url: path + '/api/fuellogs/' + id + '?AssetId=' + window.location.pathname.split('/')[2],
			headers: { 'X-AT-SessionToken': localStorage.sessionToken }
		}).done(function (response) {
			if (response.success === true) {
				$('#fuelEntryForm #id').val(response.result.id);
				$('#fuelEntryForm #fTime').val(moment(response.result.fTime).format('DD/MM/YYYY hh:mm A'));
				$('#fuelEntryForm #liters').val(response.result.liters);
				$('#fuelEntryForm #amount').val(response.result.amount);
				$('#fuelEntryForm #pricePerLiter').val(response.result.pricePerLiter);
				$('#fuelEntryForm #odo').val(response.result.odo);
				$('#fuelEntryForm #fullTank').prop("checked", response.result.fullTank && response.result.fullTank == 'y' ? true : false);
				$('#fuelEntryForm #missedRefuel').prop("checked", response.result.missedRefuel && response.result.missedRefuel == 'y' ? true : false);
				$('#fuelEntryForm #f_note').val(response.result.note);
				$('#fuelEntryModal').modal('show');
			} else {
				alert(response.error);
			}
		});
	});

	$('#fuelEntryForm').validate({
		submitHandler: function (form) {

			$('#saveFuelEntryBtn').prop('disabled', true);
			var method = $('#fuelEntryForm #id').val() == 'new' ? 'POST' : 'PUT';
			var url = $('#fuelEntryForm #id').val() == 'new' ? $(form).attr('action') : '/api/fuellogs/' + $('#fuelEntryForm #id').val();

			$.ajax({
				type: method,
				url: path + url,
				data: $(form).serialize(),
				headers: { 'X-AT-SessionToken': localStorage.sessionToken }
			}).done(function (response) {
				if (response.success === true) {
					if (response.message) {
						alert(response.message);
					}
					fuelEntryTable.ajax.reload();
					$('#fuelEntryModal').modal('hide');
				} else {
					alert(response.error);
				}
				$('#saveFuelEntryBtn').prop('disabled', false);
			});

			return false;
		}
	});

	/* ==========Service Reminder========== */

	$('#serviceItems').on('change', function () {
		_len = $('.serviceItems option:selected').length;

		if (_len != 0) {
			$('.serviceItems option:selected').each(function (i) {
				$('#costBreakupReminderTable tbody').append(
					'<tr role="row" class="odd">'
					+ '<td><span>' + scope.serviceList.find(x => x.id == this.value).componentName + '</span></td>'
					+ '<td><span>' + this.text + '</span></td>'
					+ '<td><input type="number" id="amount-service-reminder-' + this.value + '" value="" name="amount-service-reminder-' + this.value + '" onchange="validateReminderAmount(this)" class="form-control service-reminder-amount"></td>'
					+ '</tr>'
				);
				validateReminderAmount(this);
			});
		}
	});


	validateReminderAmount = function (e) {
		var sum = 0;
		$(".service-reminder-amount").each(function () {
			sum += +$(this).val();
		});
		$('#ServiceReminderEntryModal #amount').val(Math.round(sum));
	}

	$('#ServiceReminderEntryModal').on('hidden.bs.modal', function () {
		$("#ServiceReminderEntryModal #serviceReminderItems").empty();
		$('#ServiceReminderEntryModal #serviceReminderItems')[0].sumo.unload();
		$('#costBreakupReminderTable tbody').html('');
	});

	$('#ServiceReminderEntryModal').on('shown.bs.modal', function () {
		var currentTime = moment();
		$("#serviceReminderEntryForm #sTime, #serviceReminderEntryForm #inTime, #serviceReminderEntryForm #outTime").data("DateTimePicker").maxDate(currentTime);
		$("#serviceReminderEntryForm #sTime").data("DateTimePicker").defaultDate(currentTime);
		$('#serviceReminderEntryForm #odo').val(scope.odo);
		$('#serviceReminderEntryForm #eHour').val(scope.ehr);
		$('#serviceReminderEntryForm #zone, #serviceReminderEntryForm #zoneGroup').val('').trigger('change');
	});

	$('#serviceReminderTable').on('click', '.review', function (e) {
		e.preventDefault();
		var id = $(this).data('id');

		var data = {
			vehicle: window.location.pathname.split('/')[2],
			serviceType: id
		}

		$.ajax({
			contentType: "application/json",
			dataType: "json",
			type: 'GET',
			data: data,
			url: path + '/api/serviceschedules/reminders',
			headers: { 'X-AT-SessionToken': localStorage.sessionToken }
		}).done(function (response) {
			if (response.success === true) {

				$('#ServiceReminderEntryModal #id').val(response.results[0].id);
				scope.odo = response.results[0].odo;
				scope.ehr = response.results[0].ehr;
				$('#ServiceReminderEntryModal #odo').val(response.results[0].odo);
				$('#ServiceReminderEntryModal #eHour').val(response.results[0].ehr);

				$('#serviceReminderItems').empty();
				$('#costBreakupReminderTable tbody').html('');

				_serviceTypes = []; response.results[0].serviceSchedule.forEach(function (schedule) {
					_serviceTypes.push(parseInt(schedule.serviceTypeId))
				})

				_lapsedServiceTypes = []; response.results[0].lapsedServiceSchedule.forEach(function (schedule) {
					_lapsedServiceTypes.push(parseInt(schedule.serviceTypeId))
				})

				items = scope.serviceList.reduce(function (r, a) {
					r[a.componentName] = r[a.componentName] || [];
					r[a.componentName].push(a);
					return r;
				}, Object.create(null));

				_ = _serviceTypes.concat(_lapsedServiceTypes);
				_servicelist = _.filter(function (item, pos) { return _.indexOf(item) == pos });

				var $select = $("#serviceReminderItems");
				$.each(items, function (key, cat) {
					var group = $('<optgroup>', { label: key });
					$.each(cat, function (i, item) {

						if ([id].indexOf(parseInt(item.id)) > -1) {
							$("<option/>", { value: item.id, text: item.serviceName }).attr("selected", "selected").attr("disabled", "disabled")
								.appendTo(group);

							$('#costBreakupReminderTable tbody').append(
								'<tr role="row" class="odd">'
								+ '<td><span>' + item.componentName + '</span></td>'
								+ '<td><span>' + item.serviceName + '</span></td>'
								+ '<td><input type="number" id="amount-service-reminder-' + item.id + '" value="" name="amount-service-reminder-' + item.id + '" onchange="validateReminderAmount(this)" class="form-control service-reminder-amount"></td>'
								+ '</tr>'
							);

						} else {
							$("<option/>", { value: item.id, text: item.serviceName }).attr("disabled", "disabled")
								.appendTo(group);
						}

					});
					group.appendTo($select);
				});

				$('#serviceReminderItems').SumoSelect({
					okCancelInMulti: true,
					selectAll: true,
					search: true,
					searchText: 'Search...',
					noMatch: 'No matches for "{0}"',
					captionFormatAllSelected: 'All services selected',
				});

				$('#ServiceReminderEntryModal').modal('show');

			} else {
				alert(response.error);
			}
		});
	});

	$('#ServiceReminderEntryForm').validate({
		submitHandler: function (form) {

			var obj = [], items = [];
			$('#ServiceReminderEntryModal #serviceReminderItems option:selected').each(function (i) {
				obj.push($(this).val());
			});
			for (var i = 0; i < obj.length; i++) {
				items.push({
					id: obj[i],
					amount: $('input#amount-service-reminder-' + obj[i]).val()
				})
			};

			_overrideOdo = 'false';
			if (parseInt($('#ServiceReminderEntryModal #odo').val()) > parseInt(scope.odo)) {
				if (!confirm("Are you sure to override actual odometer value?")) return;
				_overrideOdo = 'true';
			}

			$('#updateServiceReminderEntryBtn').prop('disabled', true);

			var data = {
				sTime: $('#ServiceReminderEntryModal #sTime').val(),
				inTime: $('#ServiceReminderEntryModal #inTime').val(),
				outTime: $('#ServiceReminderEntryModal #outTime').val(),
				sType: items,
				amount: $('#ServiceReminderEntryModal #amount').val(),
				odo: $('#ServiceReminderEntryModal #odo').val(),
				eHour: $('#ServiceReminderEntryModal #eHour').val(),
				note: $('#ServiceReminderEntryModal #note').val(),
				zone: $('#ServiceReminderEntryModal #zone').val(),
				zoneGroup: $('#ServiceReminderEntryModal #zoneGroup').val(),
				overrideODO: _overrideOdo
			}

			var id = $('#ServiceReminderEntryModal #id').val();
			$.ajax({
				contentType: "application/json",
				dataType: "json",
				type: 'POST',
				url: path + "/api/servicelogs/" + id,
				data: JSON.stringify(data),
				headers: { 'X-AT-SessionToken': localStorage.sessionToken }
			}).done(function (response) {
				if (response.success === true) {
					serviceReminderTable.ajax.reload();
					$('#ServiceReminderEntryModal').modal('hide');
				} else {
					alert(response.error);
				}
				$('#updateServiceReminderEntryBtn').prop('disabled', false);
			});

			return false;
		}
	});





	/* ==========Service Entry========== */
	$('#serviceEntryAmount').hide();
	scope.vehicleSpecificServiceTypeMeta = [];

	$('#serviceItems').on('change', function () {
		_len = $('.serviceItems option:selected').length;
		if (_len === 0) {
			$('#costBreakupTable tbody').html('');
		} else {
			$('#costBreakupTable tbody').html('');
			$('.serviceItems option:selected').each(function (i) {
				if ($("#amount-" + this.value).length == 0) {
					var vehicleServiceTypeMeta = scope.vehicleSpecificServiceTypeMeta.find(x => x.id == this.value)
					$('#costBreakupTable tbody').append(
						'<tr role="row" class="odd">'
						+ '<td><span>' + scope.serviceList.find(x => x.id == this.value).componentName + '</span></td>'
						+ '<td><span>' + this.text + '</span></td>'
						+ '<td><input type="number" id="amount-service-entry-' + this.value + '" value="' + (vehicleServiceTypeMeta ? vehicleServiceTypeMeta.amount : '') + '" name="amount-service-entry-' + this.value + '" onchange="validateServiceEntryAmount(this)" class="form-control service-entry-amount"></td>'
						+ '</tr>'
					);
					validateServiceEntryAmount(this);
				}
			});
		}
	});

	validateServiceEntryAmount = function (e) {
		var sum = 0;
		$(".service-entry-amount").each(function () {
			sum += +$(this).val();
		});
		$('#serviceEntryModal #amount').val(Math.round(sum));
	}


	$.ajax({
		type: 'GET',
		url: path + "/api/servicelogs/servicelist",
		data: { visibility: 'SE' },
		headers: { 'X-AT-SessionToken': localStorage.sessionToken },
		success: function (json) {
			if (json.success === true) {
				scope.serviceList = json.results;

				items = scope.serviceList.reduce(function (r, a) {
					r[a.componentName] = r[a.componentName] || [];
					r[a.componentName].push(a);
					return r;
				}, Object.create(null));

				var $select = $("#serviceItems");
				$.each(items, function (key, cat) {
					var group = $('<optgroup>', { label: key });
					$.each(cat, function (i, item) {
						$("<option/>", { value: item.id, text: item.serviceName })
							.appendTo(group);
					});
					group.appendTo($select);
				});

				$('#serviceItems').SumoSelect({
					okCancelInMulti: true,
					placeholder: 'Choose service types',
					selectAll: true,
					search: true,
					searchText: 'Search...',
					noMatch: 'No matches for "{0}"',
					captionFormatAllSelected: 'All services selected',
				});

			} else {
				alert("Failed to load servicetypes. Please try again later.");
			}
		}
	});

	$('#serviceEntryModal').on('shown.bs.modal', function () {
		var currentTime = moment();
		$("#serviceEntryForm #sTime, #serviceEntryForm #inTime, #serviceEntryForm #outTime").data("DateTimePicker").maxDate(currentTime);
		$("#serviceEntryForm #sTime").data("DateTimePicker").defaultDate(currentTime);
		if ($('#serviceEntryForm #id').val() == 'new') {
			$('#serviceEntryForm #odo').val(scope.odo);
			$('#serviceEntryForm #eHour').val(scope.ehr);
			$('#serviceEntryForm #zone, #serviceEntryForm #zoneGroup').val('').trigger('change');
		}
	});

	$('#serviceEntryModal').on('hidden.bs.modal', function () {
		$('#serviceEntryForm').trigger("reset");
		$('#serviceEntryForm #id').val('new');
		$('#serviceEntryForm #sTime, #serviceEntryForm #inTime, #serviceEntryForm #outTime, #serviceEntryForm #sType, #serviceEntryForm #odo, #serviceEntryForm #eHour, #serviceEntryForm #note, #serviceEntryForm #amount').val('');
		$('#serviceItems').empty();
		$('#serviceEntryForm #zone, #serviceEntryForm #zoneGroup').val('').trigger('change');
		$('#serviceEntryForm #serviceItems')[0].sumo.unload();
		$('#costBreakupTable tbody').html('');
		scope.vehicleSpecificServiceTypeMeta = [];

		items = scope.serviceList.reduce(function (r, a) {
			r[a.componentName] = r[a.componentName] || [];
			r[a.componentName].push(a);
			return r;
		}, Object.create(null));

		var $select = $("#serviceItems");
		$.each(items, function (key, cat) {
			var group = $('<optgroup>', { label: key });
			$.each(cat, function (i, item) {

				$("<option/>", { value: item.id, text: item.serviceName })
					.appendTo(group);

			});
			group.appendTo($select);
		});

		$('#serviceItems').SumoSelect({
			okCancelInMulti: true,
			placeholder: 'Choose service types',
			selectAll: true,
			search: true,
			searchText: 'Search...',
			noMatch: 'No matches for "{0}"',
			captionFormatAllSelected: 'All services selected',
		});
	});

	$('#serviceEntryForm').validate({
		rules: {
			odo: {
				require_from_group: [1, ".s-runtime"]
			},
			eHour: {
				require_from_group: [1, ".s-runtime"]
			}
		},
		submitHandler: function (form) {

			var obj = [], items = [];
			$('#serviceEntryModal #serviceItems option:selected').each(function (i) { obj.push($(this).val()); });
			for (var i = 0; i < obj.length; i++) {
				items.push({
					id: obj[i],
					amount: $('input#amount-service-entry-' + obj[i]).val()
				})
			};

			if (items.length == 'undefined' || items.length == 0) {
				alert("Please select a service type");
				return;
			}

			_overrideOdo = 'false';
			if (parseInt($('#serviceEntryModal #odo').val()) > parseInt(scope.odo)) {
				if (!confirm("Are you sure to override actual odometer value?")) return;
				_overrideOdo = 'true';
			}

			$('#saveServiceEntryBtn').prop('disabled', true);

			var data = {
				sTime: $('#serviceEntryModal #sTime').val(),
				inTime: $('#serviceEntryModal #inTime').val(),
				outTime: $('#serviceEntryModal #outTime').val(),
				sType: items,
				amount: $('#serviceEntryModal #amount').val(),
				odo: $('#serviceEntryModal #odo').val() ? $('#serviceEntryModal #odo').val() : 0,
				eHour: $('#serviceEntryModal #eHour').val() ? $('#serviceEntryModal #eHour').val() : 0,
				note: $('#serviceEntryModal #note').val(),
				overrideODO: _overrideOdo,
				id: $('#serviceEntryModal #id').val(),
				zone: $('#serviceEntryModal #zone').val(),
				zoneGroup: $('#serviceEntryModal #zoneGroup').val(),
			}

			var id = $('#serviceEntryModal #id').val();

			id == 'new'
				? (_method = 'POST', _url = '/api/servicelogs/' + window.location.pathname.split('/')[2])
				: (_method = 'PUT', _url = '/api/servicelogs/' + id, data.AssetId = window.location.pathname.split('/')[2])

			$.ajax({
				contentType: "application/json",
				dataType: "json",
				type: _method,
				url: path + _url,
				data: JSON.stringify(data),
				headers: { 'X-AT-SessionToken': localStorage.sessionToken }
			}).done(function (response) {
				if (response.success === true) {
					serviceEntryTable.ajax.reload();
					$('#serviceEntryModal').modal('hide');
				} else {
					alert('failed to update service entry');
				}
				$('#saveServiceEntryBtn').prop('disabled', false);
			});

			return false;
		}
	});

	$('#serviceEntryTable').on('click', '.delete', function (e) {
		e.preventDefault();

		if (!confirm("Are you sure to delete this record?")) {
			return;
		}

		var ele = $(this);
		var id = ele.data('id');
		$.ajax({
			type: 'DELETE',
			url: path + '/api/servicelogs/' + id,
			headers: { 'X-AT-SessionToken': localStorage.sessionToken }
		}).done(function (response) {
			if (response.success === true) {
				if (response.reload != undefined && response.reload === true) {
					serviceEntryTable.ajax.reload();
				} else {
					serviceEntryTable
						.row(ele.closest('tr'))
						.remove()
						.draw();
				}
			} else {
				alert('Cannot delete now. Please try again later.');
			}
		});
	});

	$('#serviceEntryTable').on('click', '.edit', function (e) {
		e.preventDefault();
		var id = $(this).data('id');

		$('#serviceItems').empty();
		$('#serviceEntryForm #serviceItems')[0].sumo.unload();

		var data = {
			id: id
		}

		$.ajax({
			contentType: "application/json",
			dataType: "json",
			type: 'GET',
			data: data,
			url: path + '/api/servicelogs/' + window.location.pathname.split('/')[2],
			headers: { 'X-AT-SessionToken': localStorage.sessionToken }
		}).done(function (response) {
			if (response.success === true) {
				$('#serviceEntryModal #id').val(response.result.id);
				scope.odo = Math.round(response.result.Asset.odo / 1000);
				scope.ehr = Math.floor(response.result.Asset.engineHrs / 60);
				$('#serviceEntryModal #odo').val(response.result.odo);
				$('#serviceEntryModal #eHour').val(response.result.eHour);
				$('#serviceEntryModal #note').val(response.result.note);
				$('#serviceEntryModal #amount').val(response.result.amount);
				$('#serviceEntryModal #sTime').val(moment(response.result.sTime).format("DD/MM/YYYY hh:mm A"));
				if (response.result.inTime) {
					$('#serviceEntryModal #inTime').val(moment(response.result.inTime).format("DD/MM/YYYY hh:mm A"));
				}
				if (response.result.outTime) {
					$('#serviceEntryModal #outTime').val(moment(response.result.outTime).format("DD/MM/YYYY hh:mm A"));
				}
				if (response.result.Geozone && response.result.Geozone.id) {
					$('#serviceEntryModal #zone').val(response.result.Geozone.id).trigger('change');
				}
				if (response.result.ZoneGroup && response.result.ZoneGroup.id) {
					$('#serviceEntryModal #zoneGroup').val(response.result.ZoneGroup.id).trigger('change');
				}
				$('#serviceEntryModal #amount').val(response.result.amount);
				_serviceTypes = []; response.result.sType.forEach(function (serviceType) {
					_serviceTypes.push(parseInt(serviceType.id))
				})

				scope.vehicleSpecificServiceTypeMeta = response.result.sType;

				items = scope.serviceList.reduce(function (r, a) {
					r[a.componentName] = r[a.componentName] || [];
					r[a.componentName].push(a);
					return r;
				}, Object.create(null));

				$('#costBreakupTable tbody').html('');

				var $select = $("#serviceItems");
				$.each(items, function (key, cat) {
					var group = $('<optgroup>', { label: key });
					$.each(cat, function (i, item) {
						if (_serviceTypes.indexOf(parseInt(item.id)) > -1) {

							_ = response.result.sType.filter(obj => {
								return parseInt(obj.id) === parseInt(item.id)
							})

							var _amount = _[0].amount ? _[0].amount : 0;
							$("<option/>", { value: item.id, text: item.serviceName }).attr("selected", "selected")
								.appendTo(group);

							$('#costBreakupTable tbody').append(
								'<tr role="row" class="odd">'
								+ '<td><span>' + item.componentName + '</span></td>'
								+ '<td><span>' + item.serviceName + '</span></td>'
								+ '<td><input type="number" id="amount-service-entry-' + item.id + '" value="' + _amount + '" name="amount-service-entry-' + item.id + '" onchange="validateServiceEntryAmount(this)" class="form-control service-entry-amount"></td>'
								+ '</tr>'
							);

						} else {
							$("<option/>", { value: item.id, text: item.serviceName })
								.appendTo(group);
						}
					});
					group.appendTo($select);
				});

				$('#serviceItems').SumoSelect({
					okCancelInMulti: true,
					placeholder: 'Choose service types',
					selectAll: true,
					search: true,
					searchText: 'Search...',
					noMatch: 'No matches for "{0}"',
					captionFormatAllSelected: 'All services selected',
				})
				$('#serviceEntryModal').modal('show');
			} else {
				alert(response.error);
			}
		});
	});

	$.ajax({
		dataType: "json",
		url: path + "/api/geozones/list",
		headers: { "X-AT-SessionToken": localStorage.sessionToken },
		success: function (json) {
			if (json.success === true) {
				scope.zones = json.results;
				json.results = json.results.map(function (obj) {
					var rObj = {};
					rObj.id = obj.id;
					rObj.text = obj.name + (obj.city ? ", " + obj.city : "");
					return rObj;
				});
				$("#serviceEntryModal #zone, #serviceReminderEntryModal #zone").select2({
					theme: "classic",
					placeholder: "Select a zone",
					allowClear: true,
					data: json.results,
				});
			}
		}
	});

	$.ajax({
		dataType: "json",
		url: path + "/api/zonegroups/list",
		headers: { "X-AT-SessionToken": localStorage.sessionToken },
		success: function (json) {
			if (json.success === true) {
				scope.zoneGroups = json.results;
				json.results = json.results.map(function (obj) {
					var rObj = {};
					rObj.id = obj.id;
					rObj.text = obj.name + (obj.city ? ", " + obj.city : "");
					return rObj;
				});
				$("#serviceEntryModal #zoneGroup, #serviceReminderEntryModal #zoneGroup").select2({
					theme: "classic",
					placeholder: "Select a zone group",
					allowClear: true,
					data: json.results,
				});
			}
		}
	});

	$("#serviceEntryModal #zone").on("change", function () {
		if ($(this).val() == "") {
			$("#serviceEntryModal #zoneGroup").val('').trigger('change');
		} else {
			var zoneGroup = scope.zoneGroups.find(zoneGroup => {
				var geozone = zoneGroup.Geozones.find(x => x.id == $(this).val());
				if (geozone) {
					return zoneGroup;
				}
			});
			if (zoneGroup) {
				$("#serviceEntryModal #zoneGroup")
					.val(zoneGroup.id)
					.trigger("change");
			}
		}
	});

	$("#serviceReminderEntryModal #zone").on("change", function () {
		if ($(this).val() == "") {
			$("#serviceReminderEntryModal #zoneGroup").val('').trigger('change');
		} else {
			var zoneGroup = scope.zoneGroups.find(zoneGroup => {
				var geozone = zoneGroup.Geozones.find(x => x.id == $(this).val());
				if (geozone) {
					return zoneGroup;
				}
			});
			if (zoneGroup) {
				$("#serviceReminderEntryModal #zoneGroup").val(zoneGroup.id).trigger("change");
			}
		}
	});




	//#region	============ Document =============

	$('#documentEntryForm #frontImg, #documentEntryForm #backImg').on('change', function () {
		if (['image/jpeg', 'image/png', 'image/svg', 'image/gif', 'image/jpg', 'application/pdf'].indexOf(this.files[0].type) > -1) {
			if (this.files[0].size <= 1024 * 1024 * 5) {
				scope.file = this.files[0]
			} else {
				scope.file = null;
				$(this).val('');
				alert("File size too large. File size must be less than 5Mb");
			}
		} else {
			scope.file = null;
			$(this).val('');
			alert("Invalid File Type. Please upload a valid image or pdf file");
		}
	})

	var documentlist;
	var documentlistMap = {};
	$.ajax({
		dataType: "json",
		url: path + "/api/documents/documentlist",
		headers: { 'X-AT-SessionToken': localStorage.sessionToken },
		success: function (json) {
			if (json.success === true) {
				json.results = json.results.map(function (obj) {
					var rObj = {};
					rObj.id = obj.id;
					rObj.text = obj.text
					return rObj;
				});
				for (var i = json.results.length - 1; i >= 0; i--) {
					documentlistMap[json.results[i].id] = json.results[i].text;
				}

				documentlist = json.results;
				$("#documentEntryForm #name").select2({
					theme: "classic",
					placeholder: "Select a document",
					allowClear: true,
					data: documentlistMap
				})
					.val(null)
					.trigger("change.select2");

			} else {
				alert("Cant load document list. Please try again later.");
			}

		}
	});

	var documentMap = {};
	var documentEntryTable;
	if (window.location.href.includes('renewalreminders')) {
		datatableRender();
	};

	$('.nav-tabs .renewalreminders').on('show.bs.tab', function () {
		datatableRender();
	});

	function datatableRender() {
		documentEntryTable = $('#documentEntryTable').DataTable({
			"ajax": {
				"dataType": 'json',
				"headers": { 'X-AT-SessionToken': localStorage.sessionToken },
				"type": "GET",
				"url": path + "/api/documents/list/" + window.location.pathname.split('/')[2],
				"dataSrc": "results"
			},
			"dom": '<"top-filters-3"lBf>rt<"bottom-filters-2"ip>',
			"paging": false,
			"searching": false,
			"bDestroy": true,
			"buttons": [
				{ "extend": 'excel', "title": 'Document Reminders' },
				{ "extend": 'pdfHtml5', "orientation": 'landscape', "pageSize": 'A3' }
			],
			"fixedColumns": {
				"leftColumns": 1,
				"rightColumns": 1
			},
			"scrollY": "60vh",
			"scrollX": true,
			"scrollCollapse": true,
			"columnDefs": [
				{
					"defaultContent": "-",
					"targets": "_all"
				}
			],
			"columns": [
				{
					"data": "dname",
					"defaultContent": "",
					"render": function (data, type, full, meta) {
						if (full.details.CRM) {
							return full.name || '';
						} else {
							return data || '';
						}
					}
				},
				{ "data": "note", "orderable": false },
				{
					"data": "interval",
					"class": "align-center",
					"orderable": false,
					"render": function (data, type, full, meta) {
						return data + ' months';
					}
				},
				{
					"data": "dueDate",
					"class": "align-center",
					"render": function (data, type, full, meta) {
						return moment(data).format("DD/MM/YYYY");
					}
				},
				{
					"data": "notifyDays",
					"class": "align-center",
					"render": function (data, type, full, meta) {
						return data + ' days';
					}
				},
				{
					"data": "terms",
					"class": "align-center",
					"orderable": false,
					"render": function (data, type, full, meta) {
						return data == 0 ? '' : data;
					}
				},
				{ "data": "cName" },
				{ "data": "amount" },
				{
					"data": "details",
					"class": "whitespace-pre align-center",
					render: function (data, type, full, meta) {
						var refNo = '';
						if (data && Object.keys(data).length > 0) {
							refNo = data.refNo;
						}
						return refNo;
					}
				},
				{
					"data": "details",
					"class": "align-right",
					render: function (data, type, full, meta) {
						var loanAmount = '';
						if (data && Object.keys(data).length > 0) {
							loanAmount = data.amount;
						}
						return loanAmount;
					}
				},
				{
					"data": "verified",
					"render": function (data, type, full, meta) {
						return data == true ? '<span class="label label-success">Verified</span>' : '<span class="label label-warning">Unverified</span>';
					}
				},
				{
					"data": 'verifiedBy',
					"defaultContent": '',
					render: function (data, type, full, meta) {
						if (full.details.CRM) {
							return 'System';
						} else if (data) {
							return data.username || '';
						}
					}
				},
				{
					"data": null,
					"width": 140,
					"targets": -1,
					"orderable": false,
					"render": function (data, type, full, meta) {
						var buttons = '';
						let allButtons = [];
						let { front, back } = full.image ?? {};
						if (front) {
							front = cdnUrl + front.trim();
						}
						if (back) {
							back = cdnUrl + back.trim();
						}
						if (front || back) {
							allButtons.push(`<a data-front-url="${front || ''}" data-back-url="${back || ''}" class="image btn btn-default btn-xs" style="margin-bottom: 5px;">Images</a> `);
						}
						if (!full.details.CRM) {
							if ((moment(full.dueDate) - moment()) / 86400000 <= full.notifyDays) {
								allButtons.push('<a data-id="' + data.id + '" class="paid btn btn-warning btn-xs" style="margin-bottom: 5px;">Renew</a> ');
							}
							if (assetData && assetData.actions.edit == "true") {
								allButtons.push('<a data-id="' + data.id + '" class="edit btn btn-default btn-xs" style="margin-bottom: 5px;">Edit</a> ');
							}
							if (componentsData.indexOf('Document Verify') > -1) {
								allButtons.push('<a data-id="' + data.id + '" class="verify btn btn-default btn-xs" style="margin-bottom: 5px;">Verify</a> ');
							}
							if (assetData && assetData.actions.delete == "true") {
								allButtons.push('<a data-id="' + data.id + '" class="delete btn btn-danger btn-xs" style="margin-bottom: 5px;">Delete</a>');
							}
						}

						var buttons = '';
						if (allButtons.length) {
							allButtons.forEach(function (button, index) {
								buttons += button;
								if ((index + 1) % 2 == 0) {
									buttons += '<br>';
								}
							});
						}
						return buttons;
					}
				}
			]
		});

		documentEntryTable.on('draw', function () {
			$.fn.dataTable.tables({ visible: true, api: true }).columns.adjust().fixedColumns().relayout();
		});
	}

	let assetDocumentList = [];
	$.ajax({
		dataType: "json",
		type: "GET",
		url: path + "/api/documents/list/" + window.location.pathname.split('/')[2],
		headers: { "X-AT-SessionToken": localStorage.sessionToken },
		success: function (json) {
			if (json.success === true) {
				assetDocumentList = json.results;
			}
		}
	});

	$('#documentPreviewModal').on('click', '.viewDocument', function () {
		try {
			$(this).data('viewer').show();
		} catch (err) {
			$('.viewDocument').viewer(viewerOptions);
			$(this).data('viewer').show();
		}
	});

	$('#documentEntryTable').on('click', '.image', async function () {
		try {
			let { frontUrl, backUrl } = $(this).data();
			let [frontBlob, backBlob] = await Promise.all([frontUrl, backUrl].map(u => u ? getBlobFromUrl(u) : null));

			if (frontBlob) {
				renderDoc(frontBlob, '.documentFront .media', frontBlob.type == 'application/pdf');
			}

			if (backBlob) {
				renderDoc(backBlob, '.documentBack .media', backBlob.type == 'application/pdf');
			}

			if (frontBlob || backBlob) {
				let rowData = documentEntryTable.row($(this).closest('tr')).data();
				$('#documentPreviewModal .modal-title').text(`Image/PDF Preview (${rowData.dname || rowData.name})`);
				if (rowData.name == '36') {
					$('.documentBack label').text('Side');
				}
				$('#documentPreviewModal').modal('show');
			} else {
				alert('No document found');
			}
		} catch (err) {
			alert('Error while trying to open document.', err.msg);
		}
	});

	$('#documentPreviewModal').on('hidden.bs.modal', function (e) {
		e.preventDefault();
		let defaultMsg = `
			<div style="display: flex; justify-content: center; align-items: center; height: 110px;">
				<span style="height: 110px; border: 1px solid #aaa; display: flex; justify-content: center; align-items: center; padding: 5px;">
					Not Available
				</span>
			</div>`;
		$('.documentFront .media, .documentBack .media').html(defaultMsg);
		$('#documentPreviewModal .modal-title').text('Image/PDF Preview');
		$('.documentBack label').text('Back');
	});

	$('#documentEntryModal').on('shown.bs.modal', function () {
		$('#documentEntryForm .roadTaxCheck').hide();
		var data = documentlist.slice();
		var documentData = jQuery.extend({}, documentMap);
		var selectedDocumentID = -1;

		// during edit process
		if ($('#documentEntryForm #name').val() > 0) {
			selectedDocumentID = $('#documentEntryForm #name').val();
			for (var key in documentData) {
				if (documentData.hasOwnProperty(key)) {
					if (documentData[key] == $('#documentEntryForm #name').val()) {
						delete documentData[key];
						break;
					}
				}
			}
		}

		for (var i = data.length - 1; i >= 0; i--) {
			for (var key in documentData) {
				if (documentData.hasOwnProperty(key)) {
					if (documentData[key] == data[i].id) {
						data.splice(i, 1);
						break;
					}
				}
			}
		}

		$("#documentEntryForm #name").select2({
			theme: "classic",
			placeholder: "Select a document",
			allowClear: true,
			data: data
		})
			.val(null)
			.trigger("change.select2");
		$("#documentEntryForm #name").val(selectedDocumentID > 0 ? selectedDocumentID : null).trigger("change");

		if (assetDocumentList.length && $("#documentEntryModal #id").val() == "new") {
			for (let document of assetDocumentList) {
				$(`#documentEntryForm #name option[value=${document.name}]`).remove();
			}
			$("#documentEntryForm #name").val(null).trigger("change.select2");
		}

		if (dueDate && moment(dueDate).year() > 2100) {
			$("#ltt").prop("checked", true);
			$('#dueDate').prop('readonly', true).trigger("change");
			$('#dueDate').prop('required', false).trigger("change");
			$('#documentEntryForm .gracePeriodShow, .notifyPeriod, .notifyInterval').hide();
		}

	});

	$('#documentEntryModal').on('hidden.bs.modal', function () {
		$("#documentEntryForm #dueDate,#notifyDays,#interval,#terms,#cName,#amount,#note,#frontImg,#backImg,#gracePeriod").val("");
		$("#documentEntryForm #name").val(null).trigger('change');
		$("#documentEntryModal #ptype").val('edit');//need to set to default
		$('#documentEntryForm #name').data('select2').selection.clear();
		$('#documentEntryModal #id').val('new');
		$('#documentEntryForm .roadTaxCheck').hide();
		$('.photoBackLabel').text('Photo (Back)');
	});

	var dueDate = '';
	$('#documentEntryForm #name').on('change', function (e) {
		if (!$('#documentEntryForm #interval').val()) {
			$('#documentEntryForm #interval').val(12);
		}
		$('#documentEntryForm #terms-form, #cIName, .roadTaxCheck, .gracePeriodShow, .loanRefNo, .loanAmt').hide();
		$('#documentEntryForm #cName, .notifyPeriod, .notifyInterval').show();
		$('#dueDate').prop('readonly', false);
		$('#dueDate').prop('required', true);

		if ($(this).val() == '3' && $('#documentEntryForm #id').val() != 'new') {
			$('#dueDate').val(dueDate);
			$('.roadTaxCheck').show();
			if (!dueDate) {
				$("#ltt").prop("checked", true);
				$('#dueDate, #interval').val(null);
				$('#dueDate').prop('readonly', true);
				$('#dueDate').prop('required', false);
				$('#documentEntryForm .gracePeriodShow, .notifyPeriod, .notifyInterval').hide();
			} else {
				$('#documentEntryForm .gracePeriodShow, .notifyPeriod, .notifyInterval').show();
			}
		} else {
			$("#ltt").prop("checked", false);
		}

		if ($(this).val() == "6") {
			$('#documentEntryForm #interval').val(1);
			$('#documentEntryForm #terms-form, .loanRefNo, .loanAmt').show();
			$('#documentEntryForm .gracePeriodShow').hide();
		} else if ($(this).val() == "3") {
			if ($('#documentEntryForm #id').val() == 'new') {
				$('#documentEntryForm .roadTaxCheck, .gracePeriodShow').show();
			}
			$("#ltt").on("change", function (e) {
				var llt = $(this);
				if (llt.is(":checked")) {
					$('#dueDate, #interval').val(null);
					$('#dueDate').prop('readonly', true);
					$('#dueDate').prop('required', false);
					$('#documentEntryForm .gracePeriodShow, .notifyPeriod, .notifyInterval').hide();
				} else {
					$('#dueDate').val(dueDate ? dueDate : moment().format('YYYY-MM-DD'));
					$('#dueDate').prop('readonly', false);
					$('#dueDate').prop('required', true);
					$('#documentEntryForm .gracePeriodShow, .notifyPeriod, .notifyInterval').show();
					$('#documentEntryForm #interval').val(3);
					if (!$('#documentEntryForm #gracePeriod').val() || $('#documentEntryForm #gracePeriod').val() <= 0) {
						$('#documentEntryForm #gracePeriod').val(90);
					}
				}
			});
		} else if ($(this).val() == "2") {
			$('#documentEntryForm #cName, .gracePeriodShow').hide();
			$('#documentEntryForm #cIName').show();
		}
	});

	$('#documentEntryTable').on('click', '.delete', function (e) {
		e.preventDefault();

		if (!confirm("Are you sure to delete this record?")) {
			return;
		}

		var ele = $(this);
		var id = ele.data('id');
		$.ajax({
			type: 'DELETE',
			url: path + '/api/documents/' + id,
			headers: { 'X-AT-SessionToken': localStorage.sessionToken }
		}).done(function (response) {
			if (response.success === true) {
				delete documentMap[id];
				if (response.reload != undefined && response.reload === true) {
					documentEntryTable.ajax.reload();
				} else {
					documentEntryTable
						.row(ele.closest('tr'))
						.remove()
						.draw();
				}
			} else {
				alert('Cannot delete now. Please try again later.');
			}
		});
	});

	$('#documentEntryTable').on('click', '.edit', function (e) {
		e.preventDefault();
		var ele = $(this);
		var id = ele.data('id');
		$.ajax({
			type: 'GET',
			url: path + '/api/documents/' + id,
			headers: { 'X-AT-SessionToken': localStorage.sessionToken }
		}).done(async function (response) {
			try {
				if (response.success === true) {

					$("#documentEntryForm #name").select2("destroy");
					$("#documentEntryForm #name option:gt(0)").remove();
					$("#documentEntryForm #name").select2({
						theme: "classic",
						placeholder: "Select a document",
						allowClear: true,
						data: documentlist
					})
						.val(null)
						.trigger("change.select2");

					dueDate = response.document.dueDate ? moment(response.document.dueDate).format("YYYY-MM-DD") : '';
					var details = response.document.details;
					var loanRefNo = '', loanAmount = '';
					if (Object.keys(details).length > 0) {
						loanRefNo = details.refNo;
						loanAmount = details.amount;
					}

					$('#documentEntryModal #id').val(response.document.id);
					$("#documentEntryModal #ptype").val('edit');
					$('#documentEntryForm #note').val(response.document.note);
					$('#documentEntryForm #dueDate').val(dueDate);
					$('#documentEntryForm #notifyDays').val(response.document.notifyDays);
					$('#documentEntryForm #interval').val(response.document.interval);
					$('#documentEntryForm #terms').val(response.document.terms);
					$('#documentEntryForm #cName').val(response.document.cName);
					$('#documentEntryForm #cIName').val(response.document.cName);
					$('#documentEntryForm #amount').val(response.document.amount);
					$('#documentEntryForm #gracePeriod').val(response.document.gracePeriod);
					$('#documentEntryForm #loanRefNo').val(loanRefNo);
					$('#documentEntryForm #loanAmount').val(loanAmount);
					if (cdnUrl) {
						if (response.document.image.front && response.document.image.front.length) {
							let blob = await getBlobFromUrl(cdnUrl + response.document.image.front);
							renderDoc(blob, '#frontImg-preview', blob.type == 'application/pdf', height = '20');
							$('#frontImg-preview').show();
						} else {
							$('#frontImg-preview').hide();
						}
						if (response.document.image.back && response.document.image.back.length) {
							let blob = await getBlobFromUrl(cdnUrl + response.document.image.back);
							renderDoc(blob, '#backImg-preview', blob.type == 'application/pdf', height = '20');
							$('#backImg-preview').show();
						} else {
							$('#backImg-preview').hide();
						}
					}
					$('#documentEntryForm #name').select2().val(response.document.name).trigger("change");

					if (response.document.name == '36') {
						$('.photoBackLabel').text('Photo (Side)');
					}

					$('#documentEntryModal').modal('show');
				} else {
					alert(response.message);
				}
			} catch (err) {
				alert('Error opening document.', err.msg);
			}
		});
	});

	$('#documentEntryTable').on('click', '.paid', function (e) {
		e.preventDefault();
		var ele = $(this);
		var id = ele.data('id');
		$.ajax({
			type: 'GET',
			url: path + '/api/documents/' + id,
			headers: { 'X-AT-SessionToken': localStorage.sessionToken }
		}).done(function (response) {
			if (response.success === true) {

				$("#documentEntryForm #name").select2("destroy");
				$("#documentEntryForm #name option:gt(0)").remove();
				$("#documentEntryForm #name").select2({
					theme: "classic",
					placeholder: "Select a document",
					allowClear: true,
					data: documentlist
				})
					.val(null)
					.trigger("change.select2");

				dueDate = response.document.dueDate ? moment(response.document.dueDate).add(response.document.interval, 'months').format("YYYY-MM-DD") : '';
				$('#documentEntryModal #id').val(response.document.id);
				$("#documentEntryModal #ptype").val('paid');
				$('#documentEntryForm #note').val(response.document.note);
				$('#documentEntryForm #dueDate').val(dueDate);
				$('#documentEntryForm #notifyDays').val(response.document.notifyDays);
				$('#documentEntryForm #interval').val(response.document.interval);
				$('#documentEntryForm #terms').val(response.document.terms);

				if (response.document.terms > 0) {
					$('#documentEntryForm #terms').val(response.document.terms - 1);
				}

				$('#documentEntryForm #cName').val(response.document.cName);
				$('#documentEntryForm #cIName').val(response.document.cName);
				$('#documentEntryForm #amount').val(response.document.amount);

				$('#documentEntryForm #name').select2().val(response.document.name).trigger("change");

				$('#documentEntryModal').modal('show');
			} else {
				alert(response.message);
			}
		});
	});

	$('#documentEntryForm').validate({
		submitHandler: function (form) {

			$('#saveDocumentEntryBtn').prop('disabled', true);
			$.ajax({
				type: $(form).attr('method'),
				url: path + $(form).attr('action'),
				data: new FormData(form),
				cache: false,
				contentType: false,
				processData: false,
				headers: { 'X-AT-SessionToken': localStorage.sessionToken }
			}).done(function (response) {
				if (response.success === true) {
					if (response.reload != undefined && response.reload === true) {
						documentEntryTable.ajax.reload();
					} else {
						documentEntryTable.row.add(response.document).draw();
					}
					$('#documentEntryModal').modal('hide');
				} else {
					alert(response.message);
				}
				$('#saveDocumentEntryBtn').prop('disabled', false);
			});

			return false;
		}
	});

	$('#documentEntryTable').on('click', '.verify', function (e) {
		e.preventDefault();
		var ele = $(this);
		var id = ele.data('id');
		$.ajax({
			type: 'GET',
			url: path + '/api/documents/' + id,
			headers: { 'X-AT-SessionToken': localStorage.sessionToken }
		}).done(function (response) {
			if (response.success === true) {
				$('#verifyId').val(response.document.id);
				if (response.document.verified) {
					$('#verified').val("true").trigger('change');
				} else {
					$('#verified').val("false").trigger('change');
				}
				$('#documentVerifyModal').modal('show');
			} else {
				alert(response.message);
			}
		});
	});

	$('#documentVerifyForm').validate({
		submitHandler: function (form) {
			$('#saveDocumentVerifyBtn').prop('disabled', true);
			$.ajax({
				type: $(form).attr('method'),
				url: path + $(form).attr('action'),
				data: $(form).serialize(),
				headers: { 'X-AT-SessionToken': localStorage.sessionToken }
			}).done(function (response) {
				if (response.success === true) {
					if (response.reload != undefined && response.reload === true) {
						documentEntryTable.ajax.reload();
					} else {
						documentEntryTable.row.add(response.document).draw();
					}
					$('#documentVerifyModal').modal('hide');
				} else {
					alert(response.message);
				}
				$('#saveDocumentVerifyBtn').prop('disabled', false);
			});

			return false;
		}
	});

	//#endregion



	//BUG: https://github.com/select2/select2/issues/4217
	$.fn.modal.Constructor.prototype.enforceFocus = $.noop;


	/* prepopulate fule log table */
	//reloadFuleLogTable();

	$.fn.dataTable.moment('DD/MM/YYYY hh:mm A');
	$.fn.dataTable.moment('DD/MM/YYYY');

	$(".minD").datetimepicker({ format: "DD/MM/YYYY" });
	$(".maxD").datetimepicker({ format: "DD/MM/YYYY" });

	$(".maxD").each(function (i) {
		$(this).data("DateTimePicker").defaultDate(moment());
	});
	$(".minD").each(function (i) {
		$(this).data("DateTimePicker").defaultDate(moment().subtract(30, 'days'));
	});

	var serviceReminderTable = $('#serviceReminderTable').DataTable({
		"ajax": {
			"dataType": 'json',
			"headers": { 'X-AT-SessionToken': localStorage.sessionToken },
			"type": "GET",
			"url": path + "/api/serviceschedules/reminders",
			"data": { 'vehicle': window.location.pathname.split('/')[2] },
			"dataSrc": function (json) {
				var reminders = [];
				if (json.results && json.results.length > 0) {

					data = json.results[0];

					scope.odo = data.odo;
					scope.ehr = data.ehr;

					data.serviceSchedule.forEach(function (schedule) {
						schedule.type = 'upcoming', schedule.serviceBasedOn = data.serviceBasedOn;
						reminders.push(schedule)
					});

					data.lapsedServiceSchedule.forEach(function (schedule) {
						schedule.type = 'lapsed', schedule.serviceBasedOn = data.serviceBasedOn;
						reminders.push(schedule)
					})

				}

				return reminders;
			}
		},
		"dom": '<"top-filters-3"lBf>rt<"bottom-filters-2"ip>',
		"buttons": [
			{ "extend": 'copy' },
			{ "extend": 'excel', "title": 'AssetTracker-Service-Reminders' }
		],
		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"order": [[2, "asc"]],
		"columnDefs": [
			{
				"targets": [3],
				"createdCell": function (td, cellData, rowData, row, col) {
					$(td).addClass('whitespace');
				}
			}
		],
		"columns": [
			{
				"data": null, "orderable": true, "render": function (data, type, full) {
					if (data.type == 'lapsed') {
						return data.serviceName + '&nbsp;&nbsp;&nbsp;<span style="margin-right:5px;background-color:#cbd5e8;color:#333;" class="label label-default">Missed</span>';
					} else {
						return data.serviceName;
					}
				}
			},
			{
				"data": null, "orderable": true, "render": function (data, type, full) {

					if (data.alertPriority == 1) {
						return 'High';
					} else if (data.alertPriority == 2) {
						return 'Medium';
					} else if (data.alertPriority == 3) {
						return 'Low';
					}
				}
			},
			{
				"data": null, "orderable": true, "render": function (data, type, full) {
					return ('<strong style=' + (data.type == 'lapsed' ? '"color: #464343;"' : '"color: #464343;"') + '> ' + (data.serviceBasedOn == 'ODO' ? (isNaN(data.lastServiceInKm) || !data.lastServiceInKm ? 'N/A' : data.lastServiceInKm + ' <small>KM</small>') : (isNaN(data.lastServiceInHr) || !data.lastServiceInHr ? 'N/A' : data.lastServiceInHr + ' <small>HR</small>')) + ' </strong>');
				}
			},
			{
				"data": null, "orderable": true, "render": function (data, type, full) {
					return ('<strong style=' + (data.type == 'lapsed' ? '"color: #464343;"' : '"color: #464343;"') + '> ' + (data.serviceBasedOn == 'ODO' ? (isNaN(data.nextServiceInKm) || !data.nextServiceInKm ? 'N/A' : data.nextServiceInKm + ' <small>KM</small>') : (isNaN(data.nextServiceInHr) || !data.nextServiceInHr ? 'N/A' : data.nextServiceInHr + ' <small>HR</small>')) + ' </strong>');
				}
			},
			{
				"data": null, "width": 150, "targets": -1, "orderable": false, "render": function (data, type, full) {
					if (assetData && assetData.actions.edit == "true") {
						return ('<a data-id="' + data.serviceTypeId + '" class="review btn btn-default btn-xs">Review</a>');
					}
				}
			},
		],
	});


	$("#filterData").click(function () {

		_diff = moment($("#serviceentry .maxD").val(), "DD/MM/YYYY hh:mm A").diff(moment($("#serviceentry .minD").val(), "DD/MM/YYYY hh:mm A"), 'days');
		if (_diff < 0 || _diff > 750) {
			alert("You can't filter logs for more than 2 years");
			return;
		}

		filter.minDate = $("#serviceentry .minD").val()
		filter.maxDate = $("#serviceentry .maxD").val()
		serviceEntryTable.ajax.reload();
	});

	var filter = {
		minDate: $("#serviceentry .minD").val(),
		maxDate: $("#serviceentry .maxD").val()
	}

	var serviceEntryTable = $('#serviceEntryTable').DataTable({
		"ajax": {
			"dataType": 'json',
			"headers": { 'X-AT-SessionToken': localStorage.sessionToken },
			"type": "GET",
			"data": function (d) {
				return $.extend(d, filter);
			},
			"url": path + "/api/servicelogs/list/" + window.location.pathname.split('/')[2],
			"dataSrc": "results"
		},
		"dom": '<"top-filters-3"lBf>rt<"bottom-filters-2"ip>',
		"buttons": [
			{ "extend": 'copy' },
			{ "extend": 'excel', "title": 'AssetTracker-Service-Summary' }
		],
		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"order": [[0, "desc"]],
		"columnDefs": [
			{
				"targets": [2],
				"createdCell": function (td, cellData, rowData, row, col) {
					$(td).addClass('whitespace');
				}
			}
		],
		"columns": [
			{
				"data": "sTime", "render": function (data, type, full, meta) {
					return moment(data).format("DD/MM/YYYY hh:mm A");
				}
			},
			{
				"data": "inTime", "render": function (data, type, full, meta) {
					return data ? moment(data).format("DD/MM/YYYY hh:mm A") : 'N/A';
				}
			},
			{
				"data": "outTime", "render": function (data, type, full, meta) {
					return data ? moment(data).format("DD/MM/YYYY hh:mm A") : 'N/A';
				}
			},
			{
				"data": null, "orderable": false, "render": function (data, type, full) {

					var html = '<div class="word-wrap">';

					_services = []; data['sType'].forEach(function (service) {
						html += '<span style="margin-right:5px;background-color:#cbd5e8;color:#333;" class="label label-default">' + service.serviceName + '</span>'
					})

					html += '</div>';
					return html;
				}
			},
			{ "data": "note", "orderable": false },
			{ "data": "odo", "orderable": false },
			{ "data": "eHour", "orderable": false },
			{ "data": "amount", "orderable": false },
			{
				"data": null, "targets": -1, "orderable": false, "render": function (data, type, full, meta) {
					var buttons = '';
					if (assetData && assetData.actions.edit == "true") {
						buttons += '<a data-id="' + data.id + '" class="edit btn btn-default btn-xs">Edit</a>';
					}
					if (assetData && assetData.actions.delete == "true") {
						buttons += '<a data-id="' + data.id + '" class="delete btn btn-danger btn-xs">Delete</a>';
					}
					return buttons;
				}
			}
		],
		"footerCallback": function (row, data, start, end, display) {
			var api = this.api(), data;
			// Total over this page
			var totalAmount = api
				.column(7, { page: 'current' })
				.data()
				.reduce(function (a, b) {
					return a + b;
				}, 0);

			// Update footer
			$(api.column(7).footer()).html(Math.round(totalAmount * 100, 0) / 100);
		}
	});


	function loadFuelEntryData(assetId, callback) {
		return $.ajax({
			type: 'GET',
			dataType: 'json',
			url: path + '/api/fuellogs/list/' + assetId,
			headers: { 'X-AT-SessionToken': localStorage.sessionToken }
		}).done(function (response) {
			if (response.success === true) {
				if (typeof callback === 'function') {
					callback(response.results);
				}
			} else {
				alert(response.error || 'Unable to read fuel entry data.');
			}
		});
	}

	var fuelEntryTable = $('#fuelEntryTable').DataTable({
		"ajax": {
			"dataType": 'json',
			"headers": { 'X-AT-SessionToken': localStorage.sessionToken },
			"type": "GET",
			"url": path + "/api/fuellogs/list/" + window.location.pathname.split('/')[2],
			"dataSrc": "results"
		},
		"dom": '<"top-filters-3"lBf>rt<"bottom-filters-2"ip>',
		"buttons": [
			{ "extend": 'copy' },
			{ "extend": 'excel', "title": 'AssetTracker-Fuellog-Summary' }
		],
		"lengthMenu": [[20, 40, -1], [20, 40, "All"]],
		"order": [[0, "desc"]],
		"columns": [
			{
				"data": "fTime", "render": function (data, type, full, meta) {
					return moment(data).format("DD/MM/YYYY hh:mm A");
				}
			},
			{ "data": "odo", "orderable": false },
			{ "data": "liters", "orderable": false },
			{
				"data": "amount", "orderable": false,
				"render": function (data, type, full, meta) {
					return isNaN(data) ? 0 : Number(data).toFixed(2);
				}
			},
			{ "data": "pricePerLiter", "orderable": false },
			{ "data": "fullTank", "defaultContent": "", "orderable": false },
			{ "data": "mileage", "defaultContent": "", "orderable": false },
			{ "data": "note", "defaultContent": "", "orderable": false },
			{
				"data": null, "targets": -1, "orderable": false, "render": function (data, type, full, meta) {
					return '<a data-id="' + data.id + '" class="edit btn btn-default btn-xs">Edit</a> <a data-id="' + data.id + '" class="delete btn btn-danger btn-xs">Delete</a>';
				}
			}
		],
		"footerCallback": function (row, data, start, end, display) {
			var api = this.api(), data;
			// Total over this page
			var totalLiter = api
				.column(2, { page: 'current' })
				.data()
				.reduce(function (a, b) {
					return a + b;
				}, 0);

			// Update footer
			$(api.column(2).footer()).html(totalLiter);

			var totalAmount = api
				.column(3, { page: 'current' })
				.data()
				.reduce(function (a, b) {
					return a + b;
				}, 0);

			// Update footer
			$(api.column(3).footer()).html(Math.round(totalAmount * 100, 0) / 100);
			var nRows = 0
			var avgPrice = api
				.column(4, { page: 'current' })
				.data()
				.reduce(function (a, b) {
					nRows++;
					return a + b;
				}, 0);

			// Update footer
			$(api.column(4).footer()).html(Math.round((avgPrice / nRows) * 100, 0) / 100);

			nRows = 0
			var avgMilage = api
				.column(6, { page: 'current' })
				.data()
				.reduce(function (a, b) {
					if (b != 0) { nRows++ }
					return a + b;
				}, 0);

			// Update footer
			$(api.column(6).footer()).html(Math.round((avgMilage / nRows) * 100, 0) / 100);

		}
	});


	$('#fuelentry .minD, #fuelentry .maxD').on("dp.change", function (e) {
		fuelEntryTable.draw();
	});

	$('#tollEntryModal').on('shown.bs.modal', function () {
		var currentTime = moment();
		$("#transactionTime").data("DateTimePicker").maxDate(currentTime);
		$("#transactionTime").data("DateTimePicker").defaultDate(currentTime);
	});

	$('#fuelEntryModal').on('hidden.bs.modal', function () {
		$("#liters,#fuelEntryForm #amount,#pricePerLiter,#f_note").val("");
	});

	$('#tollEntryModal').on('hidden.bs.modal', function () {
		$("#tollEntryForm #amount, #tollEntryForm #description").val("");
	});

	$("#tollVendor").select2({
		theme: "classic",
		placeholder: "Type",
		allowClear: false,
		data: [
			{ id: 'FASTag', text: 'FASTag' }
		],
		minimumResultsForSearch: -1
	});

	$('#tollEntryForm').validate({
		submitHandler: function (form) {
			$('#saveTollEntryBtn').prop('disabled', true);
			var data = {
				transactionTime: moment($('#tollEntryForm #transactionTime').val(), 'DD/MM/YYYY hh:mm A').format('DD-MM-YYYY HH:mm'),
				tollVendor: $('#tollEntryForm #tollVendor').val(),
				description: $('#tollEntryForm #description').val(),
				amount: $('#tollEntryForm #amount').val()
			};

			var method = $('#tollEntryForm #id').val() == 'new' ? 'POST' : 'PUT';
			var id = $('#tollEntryForm #id').val() == 'new' ? window.location.pathname.split('/')[2] : $('#tollEntryForm #id').val();
			$.ajax({
				contentType: "application/json",
				dataType: "json",
				type: method,
				url: path + "/api/tripexpenses/toll-expense/" + id,
				data: JSON.stringify(data),
				headers: { 'X-AT-SessionToken': localStorage.sessionToken }
			}).done(function (response) {
				if (response.success === true) {
					tollEntryTable.ajax.reload();
					$('#tollEntryModal').modal('hide');
				} else {
					alert(response.error);
				}
				$('#saveTollEntryBtn').prop('disabled', false);
			});
			return false;
		}
	});

	$('#tollEntryTable').on('click', '.edit', function (e) {
		e.preventDefault();
		var ele = $(this);
		var id = ele.data('id');
		$.ajax({
			type: 'GET',
			url: path + '/api/tripexpenses/toll-expense/' + id,
			headers: { 'X-AT-SessionToken': localStorage.sessionToken }
		}).done(function (response) {
			if (response.success === true) {
				$('#tollEntryForm #id').val(response.tollExpense.id);
				$("#tollEntryForm #transactionTime").val(moment(response.tollExpense.transactionTime).format('DD/MM/YYYY hh:mm A'));
				$('#tollEntryForm #description').val(response.tollExpense.description);
				$('#tollEntryForm #amount').val(response.tollExpense.amount);
				$('#tollEntryForm #tollVendor').val(response.tollExpense.vendor).trigger("change");
				$('#tollEntryModal').modal('show');
			} else {
				alert(response.error);
			}
		});
	});

	$('#tollEntryTable').on('click', '.delete', function (e) {
		e.preventDefault();
		if (!confirm("Are you sure to delete this record?")) {
			return;
		}
		var ele = $(this);
		var id = ele.data('id');
		$.ajax({
			type: 'DELETE',
			url: path + '/api/tripexpenses/toll-expense/' + id,
			headers: { 'X-AT-SessionToken': localStorage.sessionToken }
		}).done(function (response) {
			if (response.success === true) {
				tollEntryTable.ajax.reload();
				$('#tollEntryModal').modal('hide');
			} else {
				alert(response.error);
			}
		});
	});

	var tollEntryTable = $('#tollEntryTable').DataTable({
		"ajax": {
			"dataType": 'json',
			"headers": { 'X-AT-SessionToken': localStorage.sessionToken },
			"type": "GET",
			"url": path + "/api/tripexpenses/toll-expense/list/" + window.location.pathname.split('/')[2],
			"dataSrc": "results"
		},
		"dom": '<"top-filters-3"lBf>rt<"bottom-filters-2"ip>',
		"buttons": [
			{ "extend": 'copy' },
			{ "extend": 'excel', "title": 'AssetTracker-Toll-Entry' }
		],
		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
		"order": [[0, "desc"]],
		"columns": [
			{
				"data": "transactionTime", "render": function (data, type, full, meta) {
					return moment(data).format("DD/MM/YYYY hh:mm A");
				}
			},
			{ "data": "vendor" },
			{ "data": "description" },
			{ "data": "amount" },
			{
				"data": null, "targets": -1, "orderable": false, "render": function (data, type, full, meta) {
					return '<a data-id="' + data.id + '" class="edit btn btn-default btn-xs">Edit</a> <a data-id="' + data.id + '" class="delete btn btn-danger btn-xs">Delete</a>';
				}
			}
		],
	});

	$('#tollentry .minD, #tollentry .maxD').on("dp.change", function (e) {
		tollEntryTable.draw();
	});

	$('#serviceReminderTable_wrapper #serviceEntryTable_wrapper #serviceEntryTable_filter, #fuelEntryTable_wrapper #fuelEntryTable_filter, #tollEntryTable_wrapper #tollEntryTable_filter').hide(); // modify table search input
	$('#serviceReminderTable_wrapper .dataTables_length select, #serviceEntryTable_wrapper .dataTables_length select, #fuelEntryTable_wrapper .dataTables_length select, #tollEntryTable_wrapper .dataTables_length select, #documentEntryTable_wrapper .dataTables_length select').addClass("form-control xsmall");
	$('#serviceReminderTable, #serviceEntryTable, #fuelEntryTable, #tollEntryTable, #tyreListTable, #documentEntryTable').css('width', '100%');

	$('#assignTyreEntryModal, #assignTpmsEntryModal').on('shown.bs.modal', function () {
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: path + '/api/tyres/list',
			headers: { 'X-AT-SessionToken': localStorage.sessionToken },
			success: function (json) {
				if (json.success === true) {
					json.results = json.results.map(function (obj) {
						var rObj = {};
						rObj.id = obj.id;
						rObj.text = obj.tyreNo;
						return rObj;
					});

					$(".tyreNo-select2").select2({
						theme: "classic",
						placeholder: "Select a tyre",
						allowClear: true,
						data: json.results
					});

					$('#assignTpmsEntryModal .tyreNo-select2').val(tyreId).attr('readonly', 'readonly').trigger('change');

				} else {
					alert("Can't load Tyre. Please try again later.");
				}
			}
		});
	});

	$('#assignTyreEntryModal').on('hidden.bs.modal', function () {
		$('#assignTyreEntryModal #tyreNo').data('select2').selection.clear();
	});

	$('#assignTyreEntryForm').validate({
		submitHandler: function (form) {

			$('#saveAssignTyreEntryBtn').prop('disabled', true);
			$('#position').prop('disabled', false);

			$.ajax({
				type: $(form).attr('method'),
				url: path + $(form).attr('action') + $('#assignTyreEntryModal #tyreNo').select2('data')[0]['text'],
				data: $(form).serialize(),
				headers: { 'X-AT-SessionToken': localStorage.sessionToken }
			}).done(function (response) {
				if (response.success === true) {
					tyreListTable.ajax.reload();
					$('#assignTyreEntryModal').modal('hide');
				} else {
					alert(response.message);
				}
				$('#saveAssignTyreEntryBtn').prop('disabled', false);
				$('#position').prop('disabled', true);
			});

			return false;
		}
	});

	$('#assignTpmsEntryModal').on('hidden.bs.modal', function () {
		$('#assignTpmsEntryModal .tyreNo-select2').val(null).removeAttr('readonly').trigger('change');
	});

	$('#assignTpmsEntryForm').validate({
		submitHandler: function (form) {
			if ($('#tpmsId').val() < 10 && $('#tpmsId').val().length < 2) {
				return alert('Please add leading value zero for this number');
			}
			$('#saveAssignTpmsEntryBtn').prop('disabled', true);
			$.ajax({
				type: $(form).attr('method'),
				url: path + $(form).attr('action') + $('#assignTpmsEntryModal .tyreNo-select2').select2('data')[0]['text'],
				data: $(form).serialize(),
				headers: { 'X-AT-SessionToken': localStorage.sessionToken }
			}).done(function (response) {
				if (response.success === true) {
					tyreListTable.ajax.reload();
					$('#assignTpmsEntryModal').modal('hide');
				} else {
					alert(response.message);
				}
				$('#saveAssignTpmsEntryBtn').prop('disabled', false);
			});

			return false;
		}
	});

	var tyreHistoryTable = $('#tyreHistoryTable').DataTable({
		"searching": false,
		"paging": false,
		"ordering": false,
		"info": false
	});
	$('#tyreHistoryTable_wrapper').removeClass("dataTables_wrapper form-inline no-footer");

	$('#tyreListTable').on('click', '.history', function (e) {
		var id = $(this).data('id');

		$.ajax({
			type: 'GET',
			url: path + "/api/tyres/history/" + id,
			headers: { 'X-AT-SessionToken': localStorage.sessionToken }
		}).done(function (response) {
			if (response.success === true) {
				$('#tyreHistoryModal #tyreHistoryTable tbody').html('');
				$('#tyreHistoryModal .modal-title').text('')
				if (response.results.length) {
					for (var i = 0; i < response.results.length; i++) {
						var tyreImg = '';
						if (response.results[i].tyreImages) {
							response.results[i].tyreImages.split(',').forEach(function (src) {
								tyreImg += `<a target="_blank" href="${cdnUrl + src}"><img src="${cdnUrl + src}" alt="` + src + `" style="width:25px;height:25px;margin-right:5px;"></a>`;
							})
						}
						let editBtn = '';
						if (assetData && assetData.actions.edit == "true") {
							editBtn = '<a data-id=' + response.results[i].id + ' class="tyreEdit btn btn-warning btn-xs">Edit</a>';
						}
						$('#tyreHistoryModal #tyreHistoryTable tbody').append(
							'<tr role="row" class="odd"><td>'
							+ response.results[i].transaction
							+ '</td><td>' + moment(response.results[i].histDate).format('DD/MM/YYYY hh:mm:ss A')
							+ '</td><td>' + (response.results[i].treadDepth ? response.results[i].treadDepth : 'N/A')
							+ '</td><td>' + (response.results[i].position ? response.results[i].position : 'N/A')
							+ '</td><td>' + (response.results[i].odometer ? Math.round(response.results[i].odometer / 1000) : 'N/A')
							+ '</td><td>' + (response.results[i].tyreOdometer ? Math.round(response.results[i].tyreOdometer / 1000) : 'N/A')
							+ '</td><td>' + (response.results[i].inspectedBy ? response.results[i].inspectedBy : 'N/A')
							+ '</td><td>' + (response.results[i].comments ? response.results[i].comments : 'N/A')
							+ '</td><td>' + (tyreImg.length ? tyreImg : 'N/A')
							+ '</td><td>' + editBtn
							+ '</td><td>' + '' + '</td><td>' + '' + '</td><td>' + '' + '</td></tr>'
						);
					}
					$('#tyreHistoryModal .modal-title').text('Tyre History - ' + response.results[0].tyreNo);
					$('#tyreHistoryModal').modal('show');
				} else {
					alert('No history for this tyre');
					return;
				}
			}
			else {
				alert('No history for this tyre');
				return;
			}
		});

	});

	$('#tyreHistoryModal #tyreHistoryTable').on('click', '.tyreEdit', function (e) {
		if (!confirm("Are you sure to edit history? This may corrupt data")) {
			return;
		}
		e.preventDefault();
		var id = $(this).data('id');

		$.ajax({
			type: 'GET',
			url: path + '/api/tyrehistories/get/' + id,
			headers: { 'X-AT-SessionToken': localStorage.sessionToken }
		}).done(function (response) {
			if (response.success === true) {
				$('#editTyreHistoryModal #id').val(id);
				$('#editTyreHistoryModal #tyreNo').val(response.tyreHistory.tyreNo);
				$('#editTyreHistoryModal #treadDepth').val(response.tyreHistory.treadDepth ? response.tyreHistory.treadDepth : 0);
				$('#editTyreHistoryModal #odometer').val(response.tyreHistory.odometer ? response.tyreHistory.odometer : 0);
				$('#editTyreHistoryModal').modal('show');
			} else {
				alert(response.error || response.message);
			}
			$('#updateTyreHistoryBtn').prop('disabled', false);
		});
	});

	$('#editTyreHistoryForm').validate({
		submitHandler: function (form) {
			$('#updateTyreHistoryBtn').prop('disabled', true);
			if (isNaN($('#editTyreHistoryModal #treadDepth').val())) {
				return alert("Tread depth must be a numveric value");
			}
			let historyId = $('#editTyreHistoryModal #id').val();
			if (isNaN(historyId)) {
				return alert("Invalid history");
			}
			let data = {
				treadDepth: $('#editTyreHistoryModal #treadDepth').val()
			};
			if (localStorage.AccountId == 3634) {
				data.odometer = $('#editTyreHistoryModal #odometer').val() || 0
			}
			$.ajax({
				type: 'PUT',
				contentType: "application/json",
				dataType: "json",
				url: path + $(form).attr('action') + historyId,
				headers: { 'X-AT-SessionToken': localStorage.sessionToken },
				data: JSON.stringify(data),
			}).done(function (response) {
				if (response.success === true) {
					$('#editTyreHistoryModal').modal('hide');
					$('#tyreHistoryModal').modal('hide');
				} else {
					alert(response.error || response.message);
				}
				$('#updateTyreHistoryBtn').prop('disabled', false);
			});
			return false;
		}
	});

	var tyreListTable;
	$('.nav-tabs .tyrehistory').on('show.bs.tab', function () {
		tyreListTable = $('#tyreListTable').DataTable({
			"ajax": {
				"dataType": 'json',
				"headers": { 'X-AT-SessionToken': localStorage.sessionToken },
				"type": "GET",
				"url": path + "/api/tyres/asset/" + window.location.pathname.split('/')[2],
				"dataSrc": "results"
			},
			"dom": '<"top-filters-3"lBf>rt<"bottom-filters-1"i>',
			"buttons": [
				{ "extend": 'copy' },
				{ "extend": 'excel', "title": 'AssetTracker-TyreList-Summary' }
			],
			"bDestroy": true,
			"lengthMenu": [[20, 40, -1], [20, 40, "All"]],
			"order": [[1, "asc"]],
			"fixedColumns": {
				"leftColumns": 1,
				"rightColumns": 1
			},
			"scrollX": true,
			"columns": [
				{ "data": "tyreNo", "orderable": true },
				{
					"data": "lastStatus.position", "class": 'align-center', "orderable": true, "render": function (data, type, full, meta) {
						$('#' + data).addClass('exist').data('id', full.id);
						return data;
					}
				},
				{ "data": "condition", "class": 'align-center', "orderable": false },
				{ "data": "initialTreadDepth", "class": 'align-center', "orderable": true },
				{
					"data": "tpmsId", "class": 'align-center', "orderable": true, "render": function (data, type, full, meta) {
						if (!data && ($('#' + full.lastStatus.position + ' #tpms-icon').length)) {
							$('#' + full.lastStatus.position + ' #tpms-icon').remove();
						}
						if (data && !($('#' + full.lastStatus.position + ' #tpms-icon').length)) {
							$('#' + full.lastStatus.position).append(`<div id='tpms-icon' style="height: 50px; background: url('../images/tyre-tracker/tpms_active.svg') no-repeat center center;"></div>`);
						}
						return data;
					}
				},
				{
					"data": "tpmsData", "class": 'align-center', "orderable": true, "render": function (data, type, full, meta) {
						if (data && data.TPSE) {
							return parseInt(data.TPSE / 6.895); // kpa to psi
						} else {
							return '';
						}
					}
				},
				{
					"data": "tpmsData", "class": 'align-center', "orderable": true, "render": function (data, type, full, meta) {
						if (data && data.TTMP) {
							return parseInt(data.TTMP);
						} else {
							return '';
						}
					}
				},
				{ "data": "mfgBy", "orderable": true },
				{
					"data": "lastStatus.histDate", "class": 'whitespace-nowrap', "orderable": true, "render": function (data, type, full, meta) {
						return moment(data).format("DD/MM/YYYY hh:mm A");
					}
				},
				{
					"data": "",
					"class": 'align-left whitespace-nowrap',
					"orderable": true,
					"render": function (data, type, full, meta) {
						return (full && full.lastStatus && full.lastStatus.inspectedBy || '');
					}
				},
				{
					"data": "rfid",
					"class": 'align-right whitespace-nowrap',
					"orderable": true
				},
				{
					"data": null, "targets": -1, "orderable": false, "render": function (data, type, full, meta) {
						if (assetData && assetData.actions.view == "true") {
							return '<a data-id="' + data.tyreNo + '" data-tpms="' + data.tpmsId + '" class="history btn btn-default btn-xs">History</a>';
						}
					}
				}
			],
			"drawCallback": function (settings) {
				$.fn.dataTable.tables({ visible: true, api: true }).columns.adjust().fixedColumns().relayout();
			}
		});
	});

	var axleConfig = $('#axleConfig').data("axleconfig");
	var axleConfigView = $('#axleConfig');

	if (axleConfig) {
		for (var i = 0; i < axleConfig.config.length; i++) {
			var tyreRow = '';
			var axelType = '';
			var axleName = '&nbsp;';
			if (axleConfig.config[i].steerAxle && axleConfig.config[i].steerAxle == 'yes') {
				axelType += 'steer-axle';
				axleName += ' Steer';
			}
			if (axleConfig.config[i].liftAxle && axleConfig.config[i].liftAxle == 'yes') {
				axelType += ' lift-axle';
				axleName += ' Lift';
			}
			if (axleName == '&nbsp;') {
				axleName += 'Axle ' + (i + 1)
			}
			if (axleConfig.config[i].position.length == 2) {
				tyreRow += '<div id="' + (i + 1) + axleConfig.config[i].position[0] + '" class="tyre-col ' + axleConfig.config[i].position[0] + '">' + (i + 1) + axleConfig.config[i].position[0] + '</div>';
				tyreRow += '<div class="tyre-col"></div>';
				tyreRow += '<div class="tyre-col"></div>';
				tyreRow += '<div class="tyre-col"></div>';
				tyreRow += '<div class="tyre-col"></div>';
				tyreRow += '<div id="' + (i + 1) + axleConfig.config[i].position[1] + '" class="tyre-col ' + axleConfig.config[i].position[1] + '">' + (i + 1) + axleConfig.config[i].position[1] + '</div>';
			}
			if (axleConfig.config[i].position.length == 4) {
				tyreRow += '<div id="' + (i + 1) + axleConfig.config[i].position[0] + '" class="tyre-col ' + axleConfig.config[i].position[0] + '">' + (i + 1) + axleConfig.config[i].position[0] + '</div>';
				tyreRow += '<div id="' + (i + 1) + axleConfig.config[i].position[1] + '" class="tyre-col ' + axleConfig.config[i].position[1] + '">' + (i + 1) + axleConfig.config[i].position[1] + '</div>';
				tyreRow += '<div class="tyre-col"></div>';
				tyreRow += '<div class="tyre-col"></div>';
				tyreRow += '<div id="' + (i + 1) + axleConfig.config[i].position[2] + '" class="tyre-col ' + axleConfig.config[i].position[2] + '">' + (i + 1) + axleConfig.config[i].position[2] + '</div>';
				tyreRow += '<div id="' + (i + 1) + axleConfig.config[i].position[3] + '" class="tyre-col ' + axleConfig.config[i].position[3] + '">' + (i + 1) + axleConfig.config[i].position[3] + '</div>';
			}
			if (axleConfig.config[i].position.length == 8) {
				tyreRow += '<div id="' + (i + 1) + axleConfig.config[i].position[0] + '" class="tyre-col ' + axleConfig.config[i].position[0] + '">' + (i + 1) + axleConfig.config[i].position[0] + '</div>';
				tyreRow += '<div id="' + (i + 1) + axleConfig.config[i].position[1] + '" class="tyre-col ' + axleConfig.config[i].position[1] + '">' + (i + 1) + axleConfig.config[i].position[1] + '</div>';
				tyreRow += '<div id="' + (i + 1) + axleConfig.config[i].position[2] + '" class="tyre-col ' + axleConfig.config[i].position[2] + '">' + (i + 1) + axleConfig.config[i].position[2] + '</div>';
				tyreRow += '<div id="' + (i + 1) + axleConfig.config[i].position[3] + '" class="tyre-col ' + axleConfig.config[i].position[3] + '">' + (i + 1) + axleConfig.config[i].position[3] + '</div>';
				tyreRow += '<div class="tyre-col"></div>';
				tyreRow += '<div class="tyre-col"></div>';
				tyreRow += '<div id="' + (i + 1) + axleConfig.config[i].position[4] + '" class="tyre-col ' + axleConfig.config[i].position[4] + '">' + (i + 1) + axleConfig.config[i].position[4] + '</div>';
				tyreRow += '<div id="' + (i + 1) + axleConfig.config[i].position[5] + '" class="tyre-col ' + axleConfig.config[i].position[5] + '">' + (i + 1) + axleConfig.config[i].position[5] + '</div>';
				tyreRow += '<div id="' + (i + 1) + axleConfig.config[i].position[6] + '" class="tyre-col ' + axleConfig.config[i].position[6] + '">' + (i + 1) + axleConfig.config[i].position[6] + '</div>';
				tyreRow += '<div id="' + (i + 1) + axleConfig.config[i].position[7] + '" class="tyre-col ' + axleConfig.config[i].position[7] + '">' + (i + 1) + axleConfig.config[i].position[7] + '</div>';
			}
			const isSpare = axleConfig.config[i].position.some(POS => ['SP', 'SP1', 'SP2', 'SP3', 'SP4'].includes(POS));
			if (!isSpare) {
				axleConfigView.append('<div class="axle-row ' + axelType + ' axel' + (i + 1) + '"><div class="axle-name">' + axleName + '</div>' + tyreRow + '</div>');
			} else {
				axleConfig.config[i].position.map(position =>
					axleConfigView.append(`<div class="axle-row spare-axle"><div id=${position} class="tyre-col SP ${position}">${position}</div></div>`)
				)
			}
		}

	}


	var tyreId = null;
	$('#axleConfig').on('click', '.tyre-col', function (e) {
		if ($(this).hasClass('exist')) {
			var id = $(this).data('id');
			$.ajax({
				type: 'GET',
				url: path + '/api/tyres/' + id,
				headers: {
					'X-AT-SessionToken': localStorage.sessionToken
				}
			}).done(function (response) {
				if (response.success === true) {
					$('#assignTpmsEntryModal').modal('show');
					if (response.tyre.tpmsId) {
						let tpmsId = response.tyre.tpmsId;
						if (tpmsId.includes(':')) {
							tpmsId = tpmsId.slice(tpmsId.indexOf(':') + 1);
						}
						$('#tpms').val(tpmsId);
					} else {
						$('#tpms').val('');
					}
					tyreId = response.tyre.id;
					$('#assignTpmsEntryModal .tyreNo-select2').val(response.tyre.id).attr('readonly', 'readonly').trigger('change');
				} else {
					alert(response.error || response.message);
				}
			});
		} else {
			$('#assignTyreEntryModal').modal('show');
			$('#assignTyreEntryModal #tyreNo').val(null).trigger('change');
			$('#assignTyreEntryModal #position').val($(this).attr('id'));
		}
	});
});

$.fn.dataTableExt.afnFiltering.push(
	function (oSettings, aData, iDataIndex) {

		if (oSettings.nTable.getAttribute('id') != 'fuelEntryTable' && oSettings.nTable.getAttribute('id') != 'serviceEntryTable' && oSettings.nTable.getAttribute('id') != 'tollEntryTable') {
			// if not table should be ignored
			return true;
		}


		var iFini = $('#' + oSettings.sTableId).closest('.tab-pane').find('.minD').val();
		var iFfin = $('#' + oSettings.sTableId).closest('.tab-pane').find('.maxD').val();
		var iStartDateCol = 0;
		var iEndDateCol = 0;

		iFini = iFini.substring(6, 10) + iFini.substring(3, 5) + iFini.substring(0, 2);
		iFfin = iFfin.substring(6, 10) + iFfin.substring(3, 5) + iFfin.substring(0, 2);

		var datofini = aData[iStartDateCol].substring(6, 10) + aData[iStartDateCol].substring(3, 5) + aData[iStartDateCol].substring(0, 2);
		var datoffin = aData[iEndDateCol].substring(6, 10) + aData[iEndDateCol].substring(3, 5) + aData[iEndDateCol].substring(0, 2);

		if (iFini === "" && iFfin === "") {
			return true;
		}
		else if (iFini <= datofini && iFfin === "") {
			return true;
		}
		else if (iFfin >= datoffin && iFini === "") {
			return true;
		}
		else if (iFini <= datofini && iFfin >= datoffin) {
			return true;
		}
		return false;
	}
);

$.fn.dataTable.moment = function (format, locale) {
	var types = $.fn.dataTable.ext.type;

	// Add type detection
	types.detect.unshift(function (d) {
		// Null and empty values are acceptable
		if (d === '' || d === null) {
			return 'moment-' + format;
		}

		return moment(d.replace ? d.replace(/<.*?>/g, '') : d, format, locale, true).isValid() ?
			'moment-' + format :
			null;
	});

	// Add sorting method - use an integer for the sorting
	types.order['moment-' + format + '-pre'] = function (d) {
		return d === '' || d === null ?
			-Infinity :
			parseInt(moment(d.replace ? d.replace(/<.*?>/g, '') : d, format, locale, true).format('x'), 10);
	};
};

async function getBlobFromUrl(url) {
	let response = await fetch(url);
	const blob = await response.blob();
	if (blob.type == 'application/json') {
		let data = await response.json();
		if (!data.success) {
			new Error(data?.error?.message ?? 'Error fetching document.');
		}
	}
	const mimeType = await detectMimeType(blob, url);
	return new Blob([blob], { type: mimeType });
}

function renderDoc(blob, element, isPDF = false, height = '110') {
	let url = URL.createObjectURL(blob);
	let imgElement = `<img src="${isPDF ? '/images/pdfIcon.png' : url}" data-src="${url}" alt="Document ${isPDF ? 'PDF' : 'Image'}" style="height: ${height}px; cursor: pointer; ${!isPDF ? 'border: 1px solid #222;' : ''} width: ${height * 0.77}px;"/>`;
	$(element).html(`<a${isPDF ? ' href="' + url + '" target="_blank"' : ''} class="${!isPDF ? 'viewDocument' : ''}" style="height: ${height}px">${imgElement}</a>`);
	if (!isPDF) {
		$('.viewDocument').viewer(viewerOptions);
	}
}
