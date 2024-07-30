import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { OlympicService } from '../../core/services/olympic.service';
import { Olympic } from '../../core/models/Olympic';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { PieChartData } from 'src/app/core/models/pie-chart-data.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<PieChartData[]> = of([]); // Observable initialisé avec un tableau vide
  
  public pieChartData: PieChartData[] = []; // Tableau vide pour les données du graphique en secteurs
  public colorScheme: Color = { // Schéma de couleurs pour le graphique en secteurs
    name: 'colorScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#b8cbe7', '#956065', '#793d52', '#89a2db','#9780a1','#bfe0f1']
  };

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics().pipe( 
      // Appel via GET sur OlympicService pour retourner un Observable
      map((olympics: Olympic[] | undefined) => { 
        // Transformation du tableau Olympic[] en un nouveau tableau
        return (olympics || []).map(olympic => ({ 
          // Transformation de chaque objet olympic en un nouvel objet avec des propriétés name et value
          name: olympic.country, 
          // La propriété name de l'objet est assignée à la valeur olympic.country
          value: olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0)
          // La propriété value est la somme des médailles pour chaque participation
        }));
      })
    );

    this.olympics$.subscribe(data => { 
      // Abonnement à l'observable olympics$
      this.pieChartData = data; 
      // Mise à jour de pieChartData dès qu'il reçoit des nouvelles données
    });
  }
}