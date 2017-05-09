<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use App\Models\Account;
use App\Repositories\StatisticsRepository;
use App\Helpers\MarkdownParser;

class AuthorController extends Controller
{
    private $_statisticsRepository;

    public function __construct(StatisticsRepository $statisticsRepository)
    {
        $this->_statisticsRepository = $statisticsRepository;
    }

    public function index(Request $request, $id = null, $nickname = '')
    {
        $author  = $this->getAccount($request, $id);
        $profile = '';
        $stats   = null;

        if ($author) {
            $markdownParser = new MarkdownParser();

            $profile = $markdownParser->parse($author->profile ?? '');
            $stats   = $this->_statisticsRepository->getStatisticsForAccount($author);
        }

        return view('author.profile', [
            'author'  => $author,
            'profile' => $profile,
            'stats'   => $stats,
            'avatar'  => $author && $author->has_avatar
                ? Storage::url('avatars/'.$author->id.'.png')
                : null
        ]);
    }

    public function edit(Request $request, $id = null)
    {
        $author = $this->getAccount($request, $id);

        return view('author.edit-profile', [
            'author' => $author
        ]);
    }

    public function update(Request $request, $id = null)
    {
        $author = $this->getAccount($request, $id);
        if ($author === null) {
            return response('', 404);
        }

        $this->validate($request, [
            'nickname' => 'bail|required|unique:accounts,nickname,' . $author->id . ',id|min:3|max:32',
            'avatar'   => 'sometimes|image'
        ]);
        
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            
            $valid = $file->isValid();
            $size  = false;
            if ($valid) {
                $size = getimagesize($file->path());
                $valid = $size !== false && $size[0] > 0 && $size[1] > 0;
            }

            if ($valid) {
                list($width, $height) = $size;

                $factor = config('ed.avatar_size') / max($width, $height);

                $newWidth  = ceil($width * $factor);
                $newHeight = ceil($height * $factor);

                try {
                    // Read the original image into memory, and scale it to its destination size + 1.
                    // The extra 'bleed' is used to remedy a scaling bug in PHP which results in a black
                    // border in the lower as well as the right corner of the image.
                    $original = imagecreatefromstring(file_get_contents($file->path()));
                    $avatar   = imagescale($original, $newWidth + 1, $newHeight + 1, IMG_BICUBIC);

                    // Having scaled the image (using the bicubic algorithm), remove the 'bleed' and 
                    // compose the final avatar.
                    $finalAvatar = imagecreatetruecolor($newWidth, $newHeight);
                    imagecopyresized($finalAvatar, $avatar, 0, 0, 0, 0, $newWidth, $newHeight, $newWidth, $newWidth);

                    // Turn the avatar into a string. There is no known save into memory option in GD
                    // at the time when this was developed, thus use the output buffer to achive the
                    // same effect.
                    ob_start();
                    imagepng($finalAvatar);
                    $avatarAsString = ob_get_clean();

                    Storage::disk('local')->put('public/avatars/'.$author->id.'.png', $avatarAsString);
                    
                    $author->has_avatar = true;
                } catch (Exception $ex) {
                    // Images can't be processed, so bail
                    $author->has_avatar = false;
                } finally {
                    // Ensure to always free up memory.
                    if (is_resource($original)) {
                        imagedestroy($original);
                    }
                    
                    if (is_resource($avatar)) {
                        imagedestroy($avatar);
                    }

                    if (is_resource($finalAvatar)) {
                        imagedestroy($finalAvatar);
                    }
                }
            }

            unlink($file->path());
        }

        $author->nickname = $request->input('nickname');
        $author->tengwar  = $request->input('tengwar');
        $author->profile  = $request->input('profile');
        $author->save();

        return redirect()->route('author.my-profile');
    }

    private function getAccount(Request $request, $id)
    {
        if (!is_numeric($id)) {

            if (!Auth::check()) {
                return null;
            }

            $user = $request->user();
            $id = $user->id;
        }

        return Account::find($id);
    }
}
