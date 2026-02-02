import {
  Button,
  Dialog,
  Field,
  Input,
  Portal,
  useDialog,
} from "@chakra-ui/react";
import React, { useImperativeHandle } from "react";
import { useRef } from "react";
import { postData } from "../api";

class CreateEntry {
  name!: string;
  score!: number;
}

export interface GameEndDialogHandle {
  gameEnded: (score: number) => boolean;
}

export const GameEndDialog = React.forwardRef<GameEndDialogHandle, object>(
  (_, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const submitButtonRef = useRef<HTMLButtonElement | null>(null);
    const scoreLabelRef = useRef<HTMLParagraphElement | null>(null);
    const dialog = useDialog();
    const scoreRef = useRef(0);

    function inputUpdate() {
      const input = inputRef.current;
      if (!input) return;
      const submitButton = submitButtonRef.current;
      if (!submitButton) return;

      if (input.value) {
        submitButton.disabled = false;
      } else {
        submitButton.disabled = true;
      }
    }

    function submitScore() {
      const input = inputRef.current;
      if (!input) return;

      const dto = new CreateEntry();
      dto.name = input.value;
      dto.score = scoreRef.current;

      postData("leaderboard", dto).then(() => {
        location.reload();
      });
    }

    useImperativeHandle<GameEndDialogHandle, GameEndDialogHandle>(ref, () => ({
      gameEnded: (score: number): boolean => {
        dialog.setOpen(true);
        const scoreLabel = scoreLabelRef.current;
        scoreRef.current = score;
        // Scorelabel can be null, i think this happens because it is not fully initialized at this point,
        // due to the dialog just being opened. Right now, the game keeps its loop running until this function returns true
        // Could probably also be fixed with a small timeout between dialog.setOpen and scoreLabelRef.current.

        if (scoreLabel) {
          scoreLabel.innerHTML += score.toString();
          inputUpdate();
          return true;
        } else {
          return false;
        }
      },
    }));

    return (
      <Dialog.RootProvider value={dialog}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Game ended</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p ref={scoreLabelRef}>Score: </p>
                <Field.Root required>
                  <Field.Label id="username">
                    Username <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    ref={inputRef}
                    onChange={inputUpdate}
                    onKeyUp={(e) => {
                      if (
                        e.key === "Enter" &&
                        submitButtonRef.current &&
                        !submitButtonRef.current.disabled
                      ) {
                        submitScore();
                      }
                    }}
                    placeholder="Enter username"
                  />
                  <Field.HelperText>
                    Enter username to display on leaderboard
                  </Field.HelperText>
                </Field.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  variant="outline"
                  onClick={() => {
                    location.reload();
                  }}
                >
                  Cancel
                </Button>
                <Button ref={submitButtonRef} onClick={submitScore}>
                  Submit score
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.RootProvider>
    );
  },
);
