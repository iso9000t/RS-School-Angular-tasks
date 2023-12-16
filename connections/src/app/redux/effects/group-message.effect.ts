import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { GroupService } from 'src/app/main/services/group.service';
import * as GroupMessageActions from '../actions/group-message.action';
import { GroupMessageError } from 'src/app/main/models/group.model';

@Injectable()
export class GroupMessageEffects {
  constructor(private actions$: Actions, private groupService: GroupService) {}

  loadGroupMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupMessageActions.loadGroupMessages),
      mergeMap((action) =>
        this.groupService.getGroupMessages(action.groupId).pipe(
          map((response) =>
            GroupMessageActions.loadGroupMessagesSuccess({
              groupId: action.groupId,
              messages: response.Items,
            })
          ),
          catchError((error: GroupMessageError) =>
            of(GroupMessageActions.loadGroupMessagesFailure({ error }))
          )
        )
      )
    )
  );

  // Add other group message-related effects here as needed
}
