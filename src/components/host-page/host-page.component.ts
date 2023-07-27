import { Component, ElementRef, OnInit, VERSION, ViewChild } from '@angular/core';
import { AirbnbNodeService } from 'src/app/airbnb-node.service';
import { FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'host-page',
  templateUrl: './host-page.component.html',
  styleUrls: ['./host-page.component.scss']
})
export class HostPage implements OnInit {
  constructor(public airbnbService: AirbnbNodeService, private datePipe: DatePipe) { }
  @ViewChild('dialog') dialog: any;
  addBtnClicked: boolean = false;
  deleteIcon = '../../assets/svgs/delete.svg';
  staysAvaliable: any;
  stayDetails: any;
  roomTypes: any;
  amenities: any;
  room: any;
  showDetailsView: boolean = false;
  isUrlValid: boolean = true;
  staysBookingDone: any = [];
  bookingDoneMsg: any;
  cancelledStays: any = [];
  approvedStays: any = [];
  reservedStays: any = [];
  pendingStays: any = [];
  statuses: any;
  allGuests: any;

  ngOnInit(): void {
    this.getStays();
    this.resetRoom();
    this.getAmenties();
    this.getRoomTypes();
    this.getStatuses();
    this.getGuests();
  }

  getGuests() {
    this.airbnbService.getAllUsers('Guests').subscribe((res) => {
      this.allGuests = res;
    })
  }


  getStatuses() {
    this.airbnbService.getStatusMasterData().subscribe((res) => {
      this.statuses = res;
    })
  }

  getStays() {
    this.cancelledStays = [];
    this.approvedStays = [];
    this.reservedStays = [];
    this.pendingStays = [];
    this.airbnbService.getStaysByEmail(this.airbnbService.userId).subscribe((res) => {
      this.staysAvaliable = res;

      this.staysAvaliable.forEach((stay: any) => {
        if (stay.statusId == "64a5c6863be703681d948b5c") {
          this.cancelledStays.push(stay);
          stay.status = "Cancelled";
        }
        else if (stay.statusId == "64a5c6863be703681d948b5b") {
          this.approvedStays.push(stay);
          stay.status = "Approved";
        }
        else if (stay.statusId == "64a5c6863be703681d948b5d") {
          this.reservedStays.push(stay);
          stay.status = "Completed";
        }
        else if (stay.statusId == "64a5c6863be703681d948b5a") {
          this.pendingStays.push(stay);
          stay.status = "Pending";
        }
        // if(stay.guestId != null){
        //  this.bookingDoneMsg = this.bookingDoneMsg != null && this.bookingDoneMsg != undefined ?
        //   this.bookingDoneMsg + ' , ' + + stay.name + ' | ' + stay.description:
        //   "Payment Successful for the stay(s) :" + stay.name + ' | ' + stay.description;
        // }

      })
      if (this.bookingDoneMsg != null && this.bookingDoneMsg != undefined) {
        document.getElementById('dialogOpen')?.click();
      }
    })
  }

  getAmenties() {
    this.airbnbService.getAmenities().subscribe((res) => {
      this.amenities = res;
      this.amenities.forEach((x: any) => {
        x.checked = false

      });
    })
  }

  getRoomTypes() {
    this.airbnbService.getRoomTypes().subscribe((res) => {
      this.roomTypes = res;
    })
  }

  resetFields() {
    this.addBtnClicked = false;
    this.showDetailsView = false;
    this.resetRoom();
  }

  resetRoom() {
    this.room = {
      "title": "",
      "description": "",
      "price": 0,
      "street": "",
      "city": "",
      "state": "",
      "country": "",
      "amenitiesId": [
      ],
      "roomTypeId": "",
      "imgUrl" : null,
      "hostId": "",
      "statusId": "64a5c6863be703681d948b5a",
      "isAvaliable": "No",
      "checkIn": null,
      "checkOut": null,
      "paymentId": ""
    };
    this.amenities?.forEach((amenty: any) => {
      amenty.checked = false
    })
  }

  onFileSelected(event: any) {
    const selectedFile : File = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(selectedFile);
    reader.onload = (res : any)=>{
     this.room.imgUrl = res.target.result;
    }


    
  }
  validateDates() {
    let currentDate = this.getCurrentDateFormatted();//new Date().getFullYear() +  '-' +  (new Date().getMonth() + 1)+ '-'  + new Date().getDate();
    if (this.room.checkIn && this.room.checkOut) {
      const checkInDate = this.room.checkIn;
      const checkOutDate = this.room.checkOut;
  
      if (checkInDate < currentDate) {
        alert('Check-in date should be the current date or later.');
        this.room.checkIn = null; 
      }
  
      if (checkOutDate <= checkInDate) {
        alert('Check-out date should be after the check-in date.');
        this.room.checkOut = null; 
      }
    }
  }

  getCurrentDateFormatted(): string {
    // Get the current date
    const today = new Date();

    // Format the date to 'yyyy-MM-dd' (or any desired format)
    return this.datePipe.transform(today, 'yyyy-MM-dd') || '';
  }
  
  addAirBnb() {
    this.addBtnClicked = true;

  }

  isSaveEnabled() {
    return this.room.title != "" && this.room.description != "" && this.room.price != 0 && this.room.price > 0 &&
      this.room.street != "" &&
      this.room.state != "" && this.room.city != "" && this.room.country != "" &&
      this.room.roomTypeId != "" && this.room.imgUrl != "";
  }

  navigateToDetails(id: any) {
    this.airbnbService.getStayDetailsById(id).subscribe((res) => {
      this.stayDetails = res[0];
      this.stayDetails.amenities = [];
      this.stayDetails.roomType = this.roomTypes.find((v: any) => v._id == res[0].roomTypeId).name;
      this.stayDetails.status = this.statuses.find((v: any) => v._id == this.stayDetails.statusId).name;
      if (this.stayDetails.guestId) {
        this.stayDetails.guestName = this.allGuests.find((guest: any) => guest._id == this.stayDetails.guestId).name;
        this.stayDetails.guestPhone = this.allGuests.find((guest: any) => guest._id == this.stayDetails.guestId).phoneNumber;
      }
      this.stayDetails.amenitiesId.forEach((id: any) => {
        let amenty = this.amenities.find((id2: any) => id2._id == id).name;
        this.stayDetails.amenities.push(amenty);
      })
      this.showDetailsView = true;
    })
  }

  validateUrl(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    const urlPattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)*$/;
    this.isUrlValid = urlPattern.test(inputValue);
  }

  deleteAirbnb(id: any) {
    this.airbnbService.deleteStay(id).subscribe((res) => {
      alert("Deleted Successfully");
      this.resetFields();
      this.getStays();
    })
  }

  addAirbnbStay() {
    this.amenities.forEach((c: any) => {
      if (c.checked)
        this.room.amenitiesId.push(c._id);
    })
    let url = this.room.url;
    this.room.hostId = this.airbnbService.userId;
    this.airbnbService.addStay(this.room).subscribe((res) => {
      alert("Stay Added successfully and sent for approval to Admin");
      this.resetFields();
      this.getStays();
    })
  }


}