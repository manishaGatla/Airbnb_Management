import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AirbnbNodeService } from 'src/app/airbnb-node.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'guest-page',
  templateUrl: './guest-page.component.html',
  styleUrls: ['./guest-page.component.scss']
})
export class GuestPage implements OnInit {

  amenities: any;
  
  showAccNumError: boolean = false;
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
  cardName: any;
  isAddNewAccountClicked: boolean = false;
  cardSelected: any;
  allAccounts: any;
  statuses: any;
  allHosts: any;
  staysReserved: any;
  viewStaysClicked: boolean = false;
  NoofGuests: any = null;
  completedStatusId: any;
  approvedStatusId: any;
  cancelledStatusId: any;
  accountNumber: any;
  reEnteraccountNumber : any;
  routingNumber: any;
  accountsAvaliable: any;
  checkIn: any;
  checkOut: any;
  showConfirmation: boolean = false;
  allBookings: any;
  showError: boolean = false;
  constructor(public airbnbNodeService: AirbnbNodeService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.getAmenities();
    this.getRoomTypes();
    this.getAccounts();
    this.getAllAccounts();
    this.getHosts();
    this.getBookings();
  }

  getHosts() {
    this.airbnbNodeService.getAllUsers('Hosts').subscribe((res) => {
      this.allHosts = res;
    })
  }

  getBookings(){
    this.airbnbNodeService.getBookings().subscribe((res)=>{
      this.allBookings = res;
    })
  }

  validateAccountNumber(){
    if(Number(this.reEnteraccountNumber) != Number(this.accountNumber)){
        this.showAccNumError = true;
    }
    else{
        this.showAccNumError = false;
    }
}

  getStatuses() {
    this.airbnbNodeService.getStatusMasterData().subscribe((res) => {
      this.statuses = res;
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
      this.amenities = res.filter((C: any) => C.name != 'Other');
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
        //alert('No Reserved Stays');
        this.resetFields();
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
      this.staysAvaliable = this.staysAvaliable.filter((stay: any) => stay.isAvaliable);
      if (this.staysAvaliable && this.staysAvaliable.length > 0) {
        this.isSearchClicked = true;
        this.searchForm ={};

      }
      else {
        //alert("No results for the above search");
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

  validateDates() {
    let currentDate = this.getCurrentDateFormatted();//new Date().getFullYear() +  '-' +  (new Date().getMonth() + 1)+ '-'  + new Date().getDate();
    if (this.checkIn && this.checkOut) {
      const checkInDate = this.checkIn;
      const checkOutDate = this.checkOut;
  
      if (checkInDate < currentDate) {
        //alert('Check-in date should be the current date or later.');
        this.checkIn = null; 
      }
  
      if (checkOutDate <= checkInDate) {
        //alert('Check-out date should be after the check-in date.');
        this.checkOut = null; 
      }
    }
  }

  getCurrentDateFormatted(): string {
    // Get the current date
    const today = new Date();
    return this.datePipe.transform(today, 'yyyy-MM-dd') || '';
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
      let bookingDetails = this.allBookings.filter((c:any) => c.listingId == this.stayDetails._id && c.guestId == this.airbnbNodeService.userId )[0];
      this.stayDetails.checkIn = bookingDetails.checkIn;
      this.stayDetails.checkOut = bookingDetails.checkOut;

      this.stayDetails.roomType = this.roomTypes.find((v: any) => v._id == res[0].roomTypeId).name;
      this.stayDetails.amenitiesId.forEach((id: any) => {
        let amenty = this.amenities.find((id2: any) => id2._id == id).name;
        if(amenty != 'Other') this.stayDetails.amenities.push(amenty);
      })

    })
  }

  OnStayBookingClicked() {
    let bookings = this.allBookings.filter((c: any)=> c.listingId == this.stayDetails._id);
    this.showError = false;
    if(bookings && bookings.length > 0 ){
      bookings.forEach((stay : any) => {
        if(this.stayDetails.roomType == 'Shared room' && this.stayDetails.NoofGuests > this.stayDetails.NoOfGuestsBooked){
          this.showError = false;
        }
        else{
          if((stay.checkIn >= this.checkOut || stay.checkOut <= this.checkIn) && stay.checkIn != this.checkIn && stay.checkOut != this.checkOut){
            this.showError = false;
          }
          else{
            this.showError = true;
          }
        }
        
      });
    }
    this.isBookingClicked = !this.showError;
  }

  onAddNewAccountClicked() {
    this.isAddNewAccountClicked = true;
  }

  addNewAccountAndCompletePayment() {
    let numberOfNights=this.getNumberOfNights();
    const modifiedCardNumber = '************' + this.accountNumber.substring(12);
    let accountDetails = {
      "userId": this.airbnbNodeService.userId,
      "balance": this.NoofGuests != null ? Number(Number("5000") - Number(Number(this.stayDetails.price)* Number(this.NoofGuests) * numberOfNights))  :Number(Number("5000") - (Number(this.stayDetails.price) * numberOfNights) ),
      "isGuest": 1,
      "isHost": 0,
      "isAdmin": 0,
      "accountType": this.selectedPaymentMethod,
      "accountNumber": this.accountNumber,
      "cardName" : this.cardName,
      "routingNumber": this.routingNumber,
      "expireDate":this.expireDate
    }
    if (this.accountsAvaliable && this.accountsAvaliable.length > 0) {
      this.airbnbNodeService.deleteAccount(this.accountsAvaliable[0]._id).subscribe((results) => {
        this.airbnbNodeService.addAccount(accountDetails).subscribe((res) => {
          if (res.insertedId != null) {
            // //alert("Account Added Successfully");
            this.paymentCompletionProcess();
          }
        })
      })
    }
    else {
      this.airbnbNodeService.addAccount(accountDetails).subscribe((res) => {
        if (res.insertedId != null) {
          // //alert("Account Added Successfully");
          this.paymentCompletionProcess();
        }
      })
    }


  }

  paymentCompletionProcess() {
    
    let guestAcc = this.allAccounts.filter((c: any) => c._id == this.cardSelected)[0];
    let NoOfNights = this.getNumberOfNights();
    let paymentReq = {
      paymentMethod: this.isAddNewAccountClicked ? this.selectedPaymentMethod : guestAcc.accountType,
      amount:this.NoofGuests ?  Number(this.stayDetails.price * this.NoofGuests * NoOfNights)  : this.stayDetails.price * NoOfNights,
      userId: this.airbnbNodeService.userId,
      status: "Succeed",
      accountNumber: this.isAddNewAccountClicked ? '************' + this.accountNumber.substring(13) : guestAcc.accountNumber
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
      listingId: this.stayDetails._id,
      checkIn : this.checkIn,
      checkOut: this.checkOut
    }
    this.airbnbNodeService.bookingConfirmation(bookingConfirmationReq).subscribe((res) => {
      this.updateStayDetails(paymentId);
    })

  }

  bookNowAction() {
    
    if(!this.showError){
      if (this.isAddNewAccountClicked) {
        this.addNewAccountAndCompletePayment();
      }
      else {
        this.paymentCompletionProcess();
      }
    }
   
    
  }

  getNumberOfNights() {
    // Convert dates to JavaScript Date objects
    const checkIn = new Date(this.checkIn);
    const checkOut = new Date(this.checkOut);
  
    // Calculate the time difference in milliseconds
    const timeDiff = checkOut.getTime() - checkIn.getTime();
  
    // Convert milliseconds to days
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
    // Return the number of nights
    return daysDiff;
  }

  updateAccounts() {
    let noOfDays = this.getNumberOfNights();
    let adminAcc = this.allAccounts.filter((c: any) => c.isAdmin == 1)[0];
    let hostAcc = this.allAccounts.filter((c: any) => c.userId == this.stayDetails.hostId)[0];
    let guestAcc = this.allAccounts.filter((c: any) => c._id == this.cardSelected)[0];
    let AdminAccUpd = {
      id: adminAcc._id,
      balance: this.NoofGuests != null ? Number(adminAcc.balance) + Number(Number(this.stayDetails.price * 0.05)* Number(this.NoofGuests) * noOfDays) : Number(adminAcc.balance) + Number(Number(this.stayDetails.price) * 0.05 * noOfDays)
    }
    let hostAccUpd = {
      id: hostAcc._id,
      balance: this.NoofGuests != null ? Number(hostAcc.balance) + Number(Number(this.stayDetails.price * 0.05)* Number(this.NoofGuests) * noOfDays)  :Number(hostAcc.balance) + Number(Number(this.stayDetails.price) * 0.95 * noOfDays)
    }
   
    if (this.isAddNewAccountClicked) {
      forkJoin([this.airbnbNodeService.updateAccountDetails(AdminAccUpd), this.airbnbNodeService.updateAccountDetails(hostAccUpd)]).subscribe((response: any) => {
        if (response.length > 0) {
          this.resetFields();
        }
      })
    }
    else {
      let guestAccUpd = {
        id: guestAcc._id,
        balance: this.NoofGuests != null ?  Number(guestAcc.balance) - Number(Number(this.stayDetails.price) * Number(this.NoofGuests) * noOfDays) : Number(guestAcc.balance) - (Number(this.stayDetails.price) * noOfDays )
      }
      forkJoin([this.airbnbNodeService.updateAccountDetails(AdminAccUpd), this.airbnbNodeService.updateAccountDetails(guestAccUpd), this.airbnbNodeService.updateAccountDetails(hostAccUpd)]).subscribe((response: any) => {
        if (response.length > 0) {
          this.showConfirmation = true;
          this.resetFields();
          this.getBookings();
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
    if(this.stayDetails.guestId !== null && this.stayDetails.guestId !== undefined && this.stayDetails.guestId.length > 0)
     this.stayDetails.guestId.push(this.airbnbNodeService.userId) 
    else this.stayDetails.guestId = [this.airbnbNodeService.userId];
    let stayDetails = {
      statusId:  this.completedStatusId
      ,NoOfGuestsBooked :this.stayDetails.NoOfGuestsBooked + this.NoofGuests, paymentId: paymentId, 
      guestId: this.stayDetails.guestId, 
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
    this.accountNumber = null;
    this.cardSelected = null;
    this.cvv = null;
    this.selectedPaymentMethod = null;
    this.NoofGuests = null;
    this.checkIn = null;
    this.checkOut = null;
    this.amenities.forEach((x: any) => {
      x.checked = false

    });

  }
}