import { Component } from '@angular/core';
import { SanctionedEntity } from '../../models/sanctioned-entity';
import { SanctionedEntitiesService } from '../../services/sanctioned-entities.service';
import { CreateSanctionedEntityComponent } from 'src/app/create-sanctioned-entity/create-sanctioned-entity.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sanctioned-entities',
  templateUrl: './sanctioned-entities.component.html'
})
export class SanctionedEntitiesComponent {
  public entities: SanctionedEntity[] = [];

  constructor(entitiesService: SanctionedEntitiesService, private dialog: MatDialog) {
    entitiesService.getSanctionedEntities().subscribe(entities => {
      this.entities = entities;
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(CreateSanctionedEntityComponent, {
      width: '500px',
      data: { existingEntities: this.entities } 
    });

    // Handle the emitted event when a new entity is created
    dialogRef.componentInstance.entityAdded.subscribe((newEntity: SanctionedEntity) => {
      this.entities.push(newEntity);  // Add the new entity to the list without API call
    });

    //we can even use modal dialogue closed event
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     // Optionally refresh list or show toast
    //     console.log('Entity created:', result);
    //   }
    // });
  }
}
