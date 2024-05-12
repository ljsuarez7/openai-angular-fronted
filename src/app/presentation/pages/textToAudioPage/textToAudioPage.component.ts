import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent, TextMessageBoxEvent, TextMessageBoxSelectComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-text-to-audio-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxSelectComponent
  ],
  templateUrl: './textToAudioPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TextToAudioPageComponent {

  public messages = signal<Message[]>([]);
  public isLoading = signal<boolean>(false);
  
  public openAiService = inject(OpenAiService);

  public voices = signal([
    { id: "nova", text: "Nova" },
    { id: "alloy", text: "Alloy" },
    { id: "echo", text: "Echo" },
    { id: "fable", text: "Fable" },
    { id: "onyx", text: "Onyx" },
    { id: "shimmer", text: "Shimmer" },
  ]);

  handleMessageWithSelect({prompt, selectedOption: voice}: TextMessageBoxEvent){

    const message = `Voz: ${voice} | Texto: ${prompt}`;

    this.messages.update(prev => [
      ...prev,
      {
        isGpt: false,
        text: message
      }
    ]);

    this.isLoading.set(true);

    this.openAiService.textToAudio(prompt, voice)
      .subscribe( ( { message, audioUrl } ) => {

        this.isLoading.set(false);

        this.messages.update(prev => [
          ...prev,
          {
            isGpt: true,
            text: message,
            audioUrl: audioUrl
          }
        ]);

      });

  }

}
