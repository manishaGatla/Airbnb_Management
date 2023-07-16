import { Component } from '@angular/core';
import { AirbnbNodeService } from 'src/app/airbnb-node.service';

@Component({
  selector: 'airbnb-header',
  templateUrl: './airbnb-header.component.html',
  styleUrls: ['./airbnb-header.component.scss']
})
export class AirbnbHeader {

  constructor(public airbnbService: AirbnbNodeService) { }
  imgSrc = '../../assets/Images/header_logo.png';
}
