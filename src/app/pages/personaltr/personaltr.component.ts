import {Component, OnInit} from '@angular/core';
import { ChatService } from '../../services/chat.service';
@Component({
  selector: 'app-personaltr',
  templateUrl: './personaltr.component.html',
  styleUrls: ['./personaltr.component.css']
})
export class PersonalComponent implements OnInit {
  title = 'app'
  constructor(private chat: ChatService) { }

  ngOnInit() {
    this.chat.messages.subscribe(msg => {
      console.log(msg);
    })
  }

  sendMessage() {
    this.chat.sendMsg("Test Message");
  }
}