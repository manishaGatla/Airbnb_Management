import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AirbnbNodeService } from 'src/app/airbnb-node.service';

@Component({
  selector: 'guest-page',
  templateUrl: './guest-page.component.html',
  styleUrls: ['./guest-page.component.scss']
})
export class GuestPage implements OnInit {

  amenities: any;
  searchForm: any = {
    country: null,
    city: null,
    minPrice: null,
    maxPrice: null,
    checkIn : null,
    checkOut : null
  };
  roomTypes: any;
  isCardNumberValid: boolean = true;
  selectedAmenities: any = [];
  staysAvaliable: any;
  isSearchClicked: boolean = false;
  stayDetails: any;
  showDetailsView: boolean = false;
  selectedPaymentMethod: any;
  isBookingClicked: boolean = false;
  cardNumber: any;
  isDateValid: boolean = true;
  isFutureDate: boolean = true;
  cvv: any;
  isMonthValid: boolean = true;
  isCvvValid: boolean = true;
  expireDate: any;
  accountsAvaliable: any;
  isAddNewAccountClicked: boolean = false;
  cardSelected: any;
  allAccounts: any;
  statuses: any;
  allHosts: any;
  staysReserved: any;
  viewStaysClicked: boolean = false;
  NoofGuests: any = null;
  pendingStatusId: any;
  completedStatusId: any;
  approvedStatusId: any;
  cancelledStatusId: any;

  constructor(public airbnbNodeService: AirbnbNodeService) { }


  ngOnInit(): void {
    this.getAmenities();
    this.getRoomTypes();
    this.getAccounts();
    this.getAllAccounts();
    this.getStatuses();
    this.getHosts();
  }

  getHosts() {
    this.airbnbNodeService.getAllUsers('Hosts').subscribe((res) => {
      this.allHosts = res;
    })
  }

  getStatuses() {
    this.airbnbNodeService.getStatusMasterData().subscribe((res) => {
      this.statuses = res;
      this.pendingStatusId = this.statuses.find((c: any) => c.name == "Pending")._id;
      this.completedStatusId = this.statuses.find((c: any) => c.name == "Completed")._id;
      this.cancelledStatusId = this.statuses.find((c: any) => c.name == "Cancelled")._id;
      this.approvedStatusId = this.statuses.find((c: any) => c.name =="Approved")._id;
    })
  }

  getAllAccounts() {
    this.airbnbNodeService.getAllAccounts().subscribe((res) => {
      this.allAccounts = res;
    })
  }

  getAccounts() {
    this.airbnbNodeService.getAccountsByUserId(this.airbnbNodeService.userId).subscribe((res) => {
      this.accountsAvaliable = res;
    })
  }

  getAmenities() {
    this.airbnbNodeService.getAmenities().subscribe((res) => {
      this.amenities = res;
      this.amenities.forEach((x: any) => {
        x.checked = false

      });
    })
  }

  validateCvv(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    const cvvPattern = /^[0-9]{3,4}$/;
    this.isCvvValid = cvvPattern.test(inputValue);
  }

  validateExpiryDate(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    const datePattern = /^\d{2}\/\d{2}$/;
    this.isDateValid = datePattern.test(inputValue);

    if (this.isDateValid) {
      const currentDate = new Date();
      const inputDateParts = inputValue.split('/');
      const inputMonth = Number(inputDateParts[0]);
      const inputYear = Number(inputDateParts[1]);
      const inputDate = new Date(2000 + inputYear, inputMonth - 1, 1);

      this.isMonthValid = inputMonth >= 1 && inputMonth <= 12;
      this.isFutureDate = inputDate > currentDate;
    }
  }

  validateCardNumber(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    const cardNumberPattern = /^[0-9]{16}$/;
    this.isCardNumberValid = cardNumberPattern.test(inputValue);
  }

  viewStaysReservedByUser() {
    this.viewStaysClicked = true;
    this.airbnbNodeService.getStaysByEmailForGuest(this.airbnbNodeService.userId).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.staysReserved = res;
      }
      else {
        alert('No Reserved Stays');
      }
    })
  }

  searchStays() {
    this.amenities.forEach((amenty: any) => {
      if (amenty.checked)
        this.selectedAmenities.push(amenty._id)
    })
    this.searchForm.amenitiesId = this.selectedAmenities;
    this.airbnbNodeService.searchStays(this.searchForm).subscribe((res: any) => {
      this.staysAvaliable = res;
      this.staysAvaliable = this.staysAvaliable.filter((stay: any) => stay.statusId == this.approvedStatusId || (stay.statusId == this.completedStatusId && stay.NoOfGuests && stay.NoOfGuests != stay.NoOfGuestsBooked));
      if (this.staysAvaliable && this.staysAvaliable.length > 0) {
        this.isSearchClicked = true;
        this.searchForm ={};

      }
      else {
        alert("No results for the above search");
        this.isSearchClicked = false;
        this.resetFields();
      }
    })
  }

  getRoomTypes() {
    this.airbnbNodeService.getRoomTypes().subscribe((res) => {
      this.roomTypes = res;
    })
  }

  navigateToDetails(id: any) {
    this.airbnbNodeService.getStayDetailsById(id).subscribe((res) => {
      this.stayDetails = res[0];
      this.showDetailsView = true;
      this.stayDetails.amenities = [];
      if (this.stayDetails.hostId != null) {
        this.stayDetails.hostName = this.allHosts.find((host: any) => host._id == this.stayDetails.hostId).name;
        this.stayDetails.hostPhone = this.allHosts.find((host: any) => host._id == this.stayDetails.hostId).phoneNumber;
      }
      this.stayDetails.status = this.statuses.find((v: any) => v._id == this.stayDetails.statusId).name;
      this.stayDetails.roomType = this.roomTypes.find((v: any) => v._id == res[0].roomTypeId).name;
      this.stayDetails.amenitiesId.forEach((id: any) => {
        let amenty = this.amenities.find((id2: any) => id2._id == id).name;
        this.stayDetails.amenities.push(amenty);
      })

    })
  }

  OnStayBookingClicked() {
    this.isBookingClicked = true;
  }

  onAddNewAccountClicked() {
    this.isAddNewAccountClicked = true;
  }

  addNewAccountAndCompletePayment() {
    const modifiedCardNumber = '************' + this.cardNumber.substring(12);
    let accountDetails = {
      "userId": this.airbnbNodeService.userId,
      "balance": this.NoofGuests != null ? Number(Number("5000") - Number(Number(this.stayDetails.price)* Number(this.NoofGuests)))  :Number(Number("5000") - Number(this.stayDetails.price)),
      "isGuest": 1,
      "isHost": 0,
      "isAdmin": 0,
      "cardType": this.selectedPaymentMethod,
      "cardNumber": this.cardNumber
    }
    if (this.accountsAvaliable && this.accountsAvaliable.length > 0) {
      this.airbnbNodeService.deleteAccount(this.accountsAvaliable[0]._id).subscribe((results) => {
        this.airbnbNodeService.addAccount(accountDetails).subscribe((res) => {
          if (res.insertedId != null) {
            // alert("Account Added Successfully");
            this.paymentCompletionProcess();
          }
        })
      })
    }
    else {
      this.airbnbNodeService.addAccount(accountDetails).subscribe((res) => {
        if (res.insertedId != null) {
          // alert("Account Added Successfully");
          this.paymentCompletionProcess();
        }
      })
    }


  }

  paymentCompletionProcess() {
    let paymentReq = {
      paymentMethod: this.isAddNewAccountClicked ? this.selectedPaymentMethod : this.cardSelected.cardType,
      amount:this.NoofGuests ?  Number(this.stayDetails.price * this.NoofGuests) : this.stayDetails.price,
      email: this.airbnbNodeService.userId,
      status: "Succeed",
      cardNumber: this.isAddNewAccountClicked ? '************' + this.cardNumber.substring(12) : this.cardSelected.cardNumber
    }
    this.airbnbNodeService.updatePaymentDetails(paymentReq).subscribe((res) => {
      if (res && res.insertedId != null) {
        this.updateBookingProcess(res.insertedId);
      }
    });


  }

  updateBookingProcess(paymentId: any) {
    let bookingConfirmationReq = {
      hostId: this.stayDetails.hostId,
      guestId: this.airbnbNodeService.userId,
      paymentId: paymentId,
      isConfirmed: 1,
      listingId: this.stayDetails._id
    }
    this.airbnbNodeService.bookingConfirmation(bookingConfirmationReq).subscribe((res) => {
      this.updateStayDetails(paymentId);
    })

  }

  bookNowAction() {
    if (this.isAddNewAccountClicked) {
      this.addNewAccountAndCompletePayment();
    }
    else {
      this.paymentCompletionProcess();
    }
  }

  updateAccounts() {
    let adminAcc = this.allAccounts.filter((c: any) => c.isAdmin == 1)[0];
    let hostAcc = this.allAccounts.filter((c: any) => c.userId == this.stayDetails.hostId)[0];
    let guestAcc = this.allAccounts.filter((c: any) => c._id == this.cardSelected)[0];
    let AdminAccUpd = {
      id: adminAcc._id,
      balance: this.NoofGuests != null ? Number(adminAcc.balance) + Number(Number(this.stayDetails.price * 0.05)* Number(this.NoofGuests)) : Number(adminAcc.balance) + Number(Number(this.stayDetails.price) * 0.05)
    }
    let hostAccUpd = {
      id: hostAcc._id,
      balance: this.NoofGuests != null ? Number(hostAcc.balance) + Number(Number(this.stayDetails.price * 0.05)* Number(this.NoofGuests))  :Number(hostAcc.balance) + Number(Number(this.stayDetails.price) * 0.95)
    }
   
    if (this.isAddNewAccountClicked) {
      forkJoin([this.airbnbNodeService.updateAccountDetails(AdminAccUpd), this.airbnbNodeService.updateAccountDetails(hostAccUpd)]).subscribe((response: any) => {
        if (response.length > 0) {
          alert("Booking successful");
          this.resetFields();
        }
      })
    }
    else {
      let guestAccUpd = {
        id: guestAcc._id,
        balance: this.NoofGuests != null ?  Number(guestAcc.balance) - Number(Number(this.stayDetails.price) * Number(this.NoofGuests)) : Number(guestAcc.balance) - Number(this.stayDetails.price)
      }
      forkJoin([this.airbnbNodeService.updateAccountDetails(AdminAccUpd), this.airbnbNodeService.updateAccountDetails(guestAccUpd), this.airbnbNodeService.updateAccountDetails(hostAccUpd)]).subscribe((response: any) => {
        if (response.length > 0) {
          alert("Booking successful");
          this.resetFields();
        }
      })
    }

  }

  checkUserAGuest(){
    if(this.stayDetails.guestId != null && this.stayDetails.guestId != undefined && this.stayDetails.guestId.length > 0){
      return this.stayDetails.guestId.find((guest: any) => this.airbnbNodeService.userId == guest);
    }
    
    return false;
    
  }

  checkNoofGuestsValidation(){
   return  Number(this.NoofGuests) > Number(this.stayDetails.NoOfGuests - this.stayDetails.NoOfGuestsBooked);
  }

  updateStayDetails(paymentId: any) {
    let stayDetails = {
      statusId:  this.completedStatusId
      ,NoOfGuestsBooked :this.stayDetails.NoOfGuestsBooked + this.NoofGuests, paymentId: paymentId, 
      guestId: this.stayDetails.guestId !== null && this.stayDetails.guestId !== undefined && this.stayDetails.guestId.length > 0 ?  this.stayDetails.guestId.push(this.airbnbNodeService.userId) : [this.airbnbNodeService.userId], 
    }
    this.airbnbNodeService.updateStayStatus({
      id: this.stayDetails._id,
      stayDetails: stayDetails
    }).subscribe((res) => {
      this.updateAccounts();
    })
  }

  backClicked() {
    this.showDetailsView = false;
  }

  resetFields() {
    this.searchForm = {};
    this.isSearchClicked = false;
    this.showDetailsView = false;
    this.isBookingClicked = false;
    this.selectedAmenities = [];
    this.viewStaysClicked = false;
    this.isAddNewAccountClicked = false;
    this.cardNumber = null;
    this.cardSelected = null;
    this.cvv = null;
    this.selectedPaymentMethod = null;
    this.NoofGuests = null;
    this.amenities.forEach((x: any) => {
      x.checked = false

    });

  }
}