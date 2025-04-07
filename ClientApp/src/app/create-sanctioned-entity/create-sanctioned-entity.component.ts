import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SanctionedEntitiesService } from '../services/sanctioned-entities.service';
import { SanctionedEntity } from '../models/sanctioned-entity';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-sanctioned-entity',
  templateUrl: './create-sanctioned-entity.component.html',
  styleUrls: ['./create-sanctioned-entity.component.css'],
})
export class CreateSanctionedEntityComponent implements OnDestroy {
  sanctionEntityForm!: FormGroup;
  @Output() entityAdded: EventEmitter<SanctionedEntity> =
    new EventEmitter<SanctionedEntity>(); // Emit new record
  existingEntities: SanctionedEntity[] = [];
  private destory$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<CreateSanctionedEntityComponent>,
    private entityService: SanctionedEntitiesService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data?.existingEntities) {
      this.existingEntities = data.existingEntities;
    }
  }

  ngOnInit(): void {
    this.sanctionEntityForm = new FormGroup({
      name: new FormControl('', [Validators.required]), // Name is required
      domicile: new FormControl('', [Validators.required]), // Domicile is required
      accepted: new FormControl(false, [Validators.required]), // Status is required
    });
  }

  onAddEntity() {
    if (this.sanctionEntityForm.valid) {
      const newEntity = this.sanctionEntityForm.value;

      const isDuplicate = this.existingEntities.some(
        (entity) =>
          entity.name.toLowerCase().trim() ===
            newEntity.name.toLowerCase().trim() &&
          entity.domicile.toLowerCase().trim() ===
            newEntity.domicile.toLowerCase().trim()
      );

      //duplicate check at front end as well as in back end for safer side
      if (isDuplicate) {
        this.showSnackBar(
          'Duplicate entity detected. Please check name and domicile.',
          'error'
        );
        return;
      }

      this.entityService
        .addSanctionedEntity(newEntity)
        .pipe(takeUntil(this.destory$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.entityAdded.emit(response);
              this.showSnackBar(
                'Sanctioned entity successfully added.',
                'success'
              );
              this.dialogRef.close();
            }
          },
          error: (error) => {
            console.error('Error adding sanctioned entity', error);
            this.showSnackBar(
              error.status === 409
                ? error.error
                : 'An unexpected error occurred. Please try again.',
              'error'
            );
          },
        });
    } else {
      // Mark all controls as touched to show validation errors
      this.sanctionEntityForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  //to do we can even move this to common service and inject it anywhere it is required.
  private showSnackBar(
    message: string,
    type: 'success' | 'error',
    duration: number = 4000
  ): void {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: [`snackbar-${type}`],
    });
  }

  ngOnDestroy(): void {
    this.destory$.next;
    this.destory$.complete;
  }
}
