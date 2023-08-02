import { Component, OnInit } from '@angular/core';
import { AirbnbNodeService } from 'src/app/airbnb-node.service';

@Component({
  selector: 'admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPage implements OnInit {
  stayDetails: any;
  showDetailsView: any;
  allStays: any;
  statuses: any;
  roomTypes: any;
  amenities: any;
  statusId: any;
  allStatuses: any;
  cancelledStays: any = [];
  approvedStays: any = [];
  reservedStays: any = [];
  pendingStays: any = [];
  allGuests: any;
  allHosts: any;
  pendingStatusId: any;
  completedStatusId: any;
  approvedStatusId: any;
  cancelledStatusId: any;
  constructor(private airbnbNodeService: AirbnbNodeService) { }


  ngOnInit(): void {
    this.getRoomTypes();
    this.getAmenties();
    this.getStatuses();
    this.getAvaliableStays();
    this.getHosts();
    this.getGuests();
  }

  getHosts() {
    this.airbnbNodeService.getAllUsers('Hosts').subscribe((res) => {
      this.allHosts = res;
    })
  }


  getGuests() {
    this.airbnbNodeService.getAllUsers('Guests').subscribe((res) => {
      this.allGuests = res;
    })
  }

  getStatuses() {
    this.airbnbNodeService.getStatusMasterData().subscribe((res) => {
      this.statuses = res;
      this.allStatuses = res;
      this.pendingStatusId = this.statuses.find((c: any) => c.name == "Pending")._id;
      this.completedStatusId = this.statuses.find((c: any) => c.name == "Completed")._id;
      this.cancelledStatusId = this.statuses.find((c: any) => c.name == "Cancelled")._id;
      this.approvedStatusId = this.statuses.find((c: any) => c.name == "Approved")._id;
      this.statuses = this.statuses.filter((c: any) => c.name != "Pending" && c.name != "Completed")
    })
  }

  getAmenties() {
    this.airbnbNodeService.getAmenities().subscribe((res) => {
      this.amenities = res;
      this.amenities.forEach((x: any) => {
        x.checked = false

      });
    })
  }

  getRoomTypes() {
    this.airbnbNodeService.getRoomTypes().subscribe((res) => {
      this.roomTypes = res;
    })
  }

  getAvaliableStays() {
    this.cancelledStays = [];
    this.approvedStays = [];
    this.reservedStays = [];
    this.pendingStays = [];
    this.airbnbNodeService.getAllStays().subscribe((res) => {
      this.allStays = res;
      this.allStays.forEach((stay: any) => {
        if (stay.statusId == this.cancelledStatusId) {
          this.cancelledStays.push(stay);
          stay.status = "Cancelled";
        }
        else if (stay.statusId == this.approvedStatusId) {
          this.approvedStays.push(stay);
          stay.status = "Approved";
        }
        else if (stay.statusId == this.completedStatusId) {
          this.reservedStays.push(stay);
          stay.status = "Completed";
        }
        else if (stay.statusId == this.pendingStatusId) {
          this.pendingStays.push(stay);
          stay.status = "Pending";
        }
      })
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
      if (this.stayDetails.guestId && this.stayDetails.guestId.length  > 0) {
        const distinctGuests = this.stayDetails.guestId.filter(
          (guest : any, i : any, arr : any) => arr.findIndex((t: any) => t === guest) === i
        );
        distinctGuests.forEach((guestBooked : any) =>{
          this.stayDetails.guestName = this.stayDetails.guestName == null ?  this.allGuests.find((guest: any) => guest._id == guestBooked).name: this.stayDetails.guestName + ', ' +this.allGuests.find((guest: any) => guest._id == guestBooked).name ;
          this.stayDetails.guestPhone = this.stayDetails.guestPhone == null ? this.allGuests.find((guest: any) => guest._id == guestBooked).phoneNumber : this.stayDetails.guestPhone + ', ' +this.allGuests.find((guest: any) => guest._id == guestBooked).phoneNumber ;;
        })
      }
      this.stayDetails.status = this.allStatuses.find((v: any) => v._id == this.stayDetails.statusId).name;
      this.stayDetails.roomType = this.roomTypes.find((v: any) => v._id == res[0].roomTypeId).name;
      this.stayDetails.amenitiesId.forEach((id: any) => {
        let amenty = this.amenities.find((id2: any) => id2._id == id).name;
        this.stayDetails.amenities.push(amenty);


      })
    })
  }

  updateStay(stay: any) {
    this.airbnbNodeService.updateStayStatus({
      id: stay._id, statusId: this.statusId
    }).subscribe((res) => {
      alert("Status Updated Successfully");
      this.resetFields();
      this.cancelledStays = [];
      this.approvedStays = [];
      this.reservedStays = [];
      this.pendingStays = [];
      this.getAvaliableStays();
    })

  }

  resetFields() {
    this.showDetailsView = false;
    this.statusId = null;
  }
}
