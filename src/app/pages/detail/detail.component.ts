import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { LineChartData } from 'src/app/core/models/line-chart-data.model';
import { Participation } from 'src/app/core/models/Participation';
import { Olympic } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  // Déclaration d'état des propriétés
  public countryId: number = 0; // Identifiant du pays initialisé à 0
  public countryName!: string; // Nom du pays
  public lineChartData: LineChartData[] = []; // Tableau vide initialisé pour le graphique en ligne
  public totalParticipations: number = 0; // Nombre total de participations
  public totalMedals: number = 0; // Nombre total de médailles
  public totalAthletes: number = 0; // Nombre total d'athlètes

  public colorScheme: Color = {
    name: 'colorScheme',
    selectable: false,
    group: ScaleType.Ordinal,
    domain: ['#000000'] // Schéma de couleurs pour le graphique
  };

  constructor(private route: ActivatedRoute, private olympicService: OlympicService) {}

  ngOnInit(): void {
    // Récupération de l'identifiant du pays depuis la valeur de la route
    this.countryId = Number(this.route.snapshot.paramMap.get('id')!); 
    // this.countryId : variable pour stocker l'identifiant du pays
    // Number() : convertit le résultat en nombre
    // this.route : utilisation d'ActivatedRoute pour accéder aux informations de la route actuelle
    // snapshot : instantané de l'état actuel de la route
    // paramMap.get('id') : récupère l'ID de la route
    this.loadData(); // Chargement des données
}

  loadData(): void { 
    this.olympicService.getCountryData().subscribe((data: Olympic[]) => {
      // Appel getContryData du service olympicService
      // pour créer un Observable avec les données et s'abonner dessus
      if (!data || !Array.isArray(data)) { // Vérifie si data est null et si ce n'est pas un tableau retourne false
        console.error('Invalid data format'); // Vérification du format des données
        return;
      }

      const countryData = data.find((item: Olympic) => item.id === this.countryId);
      // Recherche via .find des données du pays par identifiant dans les données data reçues par l'Observable
      // va comparer item.id à la propriété countryID
      if (!countryData) {
        console.error('Country data not found'); // Vérification de l'existence des données du pays
        return;
      }

      this.countryName = countryData.country;
      // Attribution du nom du pays dans la propriété CountryName depuis la valeur trouve dans countryData
      this.lineChartData = [{
        // Ajoute des données au tableau lineChartData qui servira à alimenter le graphique
        name: countryData.country, // Récupère le nom du pays depuis countryData
        series: countryData.participations.map((participation: Participation) => ({
          // Utilise .map pour transformer chaque élément du tableau participations en un objet participation
          name: participation.year.toString(), // Convertit l'année en chaîne de caractères pour l'affichage
          value: participation.medalsCount // Récupère le nombre de médailles
        }))
      }];// Préparation des données pour le graphique en ligne


      this.totalParticipations = countryData.participations.length; // Calcul du nombre total de participations
      this.totalMedals = this.calculateTotal(countryData.participations, 'medalsCount'); // Calcul du nombre total de médailles
      // Prend en compte deux arguments le calcul : tableau participation et le mot clé 'medalsCount'
      this.totalAthletes = this.calculateTotal(countryData.participations, 'athleteCount'); // Calcul du nombre total d'athlètes
    });
  }
  // Méthode pour calculer le total d'un attribut
  private calculateTotal(participations: Participation[], key: keyof Participation): number {
    // Méthode qui prend en paramètre un tableau de participations de type Participation
    // 'keyof Participation' spécifie que 'key' doit être une clé valide de l'objet Participation
    // La méthode retourne un nombre
    return participations.reduce((sum: number, participation: Participation) => sum + Number(participation[key] as number || 0), 0);
    // Utilisation de reduce pour accumuler les valeurs du tableau participations
    // callback : sum est l'accumulateur de la somme courante et participation l'élément courant du tableau participation
    // => 'sum +' ajoute la valeur de participation[key] convertie en nombre à sum
    // Number() convertit la valeur en nombre
    // participation[key] permet d'accéder aux différentes valeurs du tableau
    // par exemple : 'medalsCount' accèdera à 'participation.medalsCount'
    // as number indique que la valeur est de type number
  }
}