<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

use App\Models\ForumPost;

class ForumPostCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    private $_cancellationToken;
    private $_post;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $cancellationToken, ForumPost $post)
    {
        $this->_cancellationToken = $cancellationToken;
        $this->_post = $post;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $this->subject(config('app.name').' - New posts notification');

        return $this->markdown('emails.forum.post-created', [
            'cancellationToken' => $this->_cancellationToken,
            'post' => $this->_post
        ]);
    }
}
