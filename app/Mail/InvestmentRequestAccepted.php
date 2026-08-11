<?php

namespace App\Mail;

use App\Models\InvestmentRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InvestmentRequestAccepted extends Mailable
{
    use Queueable, SerializesModels;

    public $investmentRequest;

    /**
     * Create a new message instance.
     */
    public function __construct(InvestmentRequest $investmentRequest)
    {
        $this->investmentRequest = $investmentRequest;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Votre demande de création de compte a été acceptée',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.investment_request_accepted',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
