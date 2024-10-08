import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { OlympicService } from '../../core/services/olympic.service';
import { Olympic } from '../../core/models/Olympic';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { PieChartData } from 'src/app/core/models/pie-chart-data.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {
  public olympics$: Observable<PieChartData[]> = of([]); // Observable initialisé avec un tableau vide typé comme PieChartData
  
  public pieChartData: PieChartData[] = []; // Tableau vide pour les données du graphique
  public colorScheme: Color = { // Schéma de couleurs pour le graphique
    name: 'colorScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#b8cbe7', '#956065', '#793d52', '#89a2db','#9780a1','#bfe0f1']
  };

  public totalYears: number = 0; // Propriété pour stocker le nombre total d'années
  public totalCountries: number = 0; // Propriété pour stocker le nombre total de pays

  private subscription: Subscription = new Subscription(); // Gestion du désabonnement

  constructor(private olympicService: OlympicService, private router : Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics().pipe( // Appel de getOlympic sur OlympicService pour retourner un Observable
      map((olympics: Olympic[] | undefined) => { // Transformation des données du tableau Olympics en un nouveau tableau Olympic[]
        const olympicsData = olympics || []; // Initialisation de olympicsData avec le tableau olympics
        
        // Calcul du nombre total d'années
        const yearsSet = new Set<number>(); // Création d'un ensemble pour stocker les années uniques via Set
        olympicsData.forEach(olympic => { // Parcours de chaque objet olympic dans olympicsData
          olympic.participations.forEach(participation => { // Parcours de chaque participation dans l'objet olympic
            yearsSet.add(participation.year); // Ajout de l'année de participation à l'ensemble yearsSet
          });
        });
        this.totalYears = yearsSet.size; // Assignation de la taille de yearsSet à la propriété totalYears

        // Calcul du nombre total de pays
        this.totalCountries = olympicsData.length; // Assignation de la longueur de olympicsData à la propriété totalCountries

        return olympicsData.map(olympic => ({ // Transformation de chaque objet olympic depuis olympicsData en un nouvel objet avec des propriétés name et value
          id: olympic.id, // Récupérer l'ID
          name: olympic.country, // La propriété name de l'objet est assignée à la valeur olympic.country
          value: olympic.participations.reduce((total, participation) => total + participation.medalsCount, 0)
          // La propriété value est la somme des médailles pour chaque participation

        }));
      })
    );

    this.olympics$.subscribe(data => { // Abonnement à l'observable olympics$ retournée avec les données name, value et ID
      this.pieChartData = data; // Mise à jour de pieChartData dès qu'il reçoit des nouvelles données
    });
  }

  // Récupère le nom du pays à partir de l'événement
 onCountryClick(event: PieChartData) {
  const countryName = event.name; 
  // Cherche le pays correspondant dans les données du graphique pieChartData
  const country = this.pieChartData.find(country => country.name === countryName);
  if (country) {// Si un pays correspondant est trouvé
    const countryId = country.id; // Récupère l'ID du pays
    this.router.navigate(['/detail', countryId]);// Navigue vers la page de détail du pays en utilisant l'ID
  }
}
ngOnDestroy(): void {
  this.subscription.unsubscribe();
}
}