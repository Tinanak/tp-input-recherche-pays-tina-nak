import { Component, ElementRef, ViewChild } from '@angular/core';
import { CountryModel } from '../country.model';
import { CountryService } from '../service.model';
import { Subscription, debounceTime, fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-pays',
  templateUrl: './pays.component.html',
  styleUrls: ['./pays.component.css']
})
export class PaysComponent {
  searchText: string;
  showList: boolean;
  filteredCountries: CountryModel[] = [];

  subscript: Subscription = new Subscription;

  @ViewChild('input')
  inputText!: ElementRef;


  constructor(private countryService: CountryService) {
    this.searchText = '';
    this.showList = false;
    this.filteredCountries = [];
    
  }

  // Fonction exécutée après la vue est initialisée
  ngAfterViewInit() {
    this.subscript = fromEvent(this.inputText?.nativeElement, 'keyup')
      .pipe(
        debounceTime(200),
        map((x) => this.inputText?.nativeElement.value)
      )
      .subscribe((x) => {
        if (x.trim().length === 0) {
          this.showList = false;
        } else {
          this.filteredCountries = this.countryService.filterCountries(x);
        }
      });
  }  
  
  // Focus sur l'élément input
  OnFocus(event: any) {
    this.searchText = event.target.value;
    if (this.searchText) {
      this.filteredCountries = this.countryService.filterCountries(this.searchText);
      this.showList = true;
    } else {
      this.filteredCountries = [];
      this.showList = false;
    }
  }
  
  // Sélection d'un pays dans la liste
  selectCountry(countryModel: CountryModel) {
    this.searchText = countryModel.name;
    this.showList = false;
  }

  // pour la perte de focus sur l'élément input
  onBlur() {
    setTimeout(() => {
      this.showList = false;
    }, 200);
  }

  //  Fonction exécutée lors de la destruction du composant
  ngOnDestroy(){
    this.subscript.unsubscribe();
  } 

}

