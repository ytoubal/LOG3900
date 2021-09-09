package com.example.thin_client.fragment

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.content.Context
import android.graphics.*
import android.os.Build
import android.os.Bundle
import android.util.AttributeSet
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.annotation.RequiresApi
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import com.example.thin_client.R
import com.example.thin_client.model.*
import com.example.thin_client.view_model.UserViewModel
import com.google.android.material.textfield.TextInputEditText
import com.google.gson.Gson


class TutorialFragment : Fragment() {

    private val user: UserViewModel by activityViewModels()
    private var currentStep = 0
    private var currentTries = 3
    private val steps = enumValues<TutorialStep>()
    private lateinit var arrowPrev: ImageButton
    private lateinit var arrowNext: ImageButton
    private lateinit var filterView: TutorialFilterView
    private lateinit var textInfoBar: TextView
    private lateinit var textInfoWrapper: FrameLayout
    private lateinit var gameFragment: GameFragment
    private lateinit var chatFragment: ChatFragment
    private lateinit var progressBar: ProgressBar
    private lateinit var finishTutorial: Button
    var guessCounter = 0
    lateinit var backBtn: ImageButton
    lateinit var tutorialBtn: ImageButton
    lateinit var leaderboardBtn: ImageButton
    lateinit var profileBtn: ImageButton
    lateinit var settingsBtn: ImageButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_tutorial, container, false)
    }

    @RequiresApi(Build.VERSION_CODES.N)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val fm = parentFragmentManager
        val teammate1 = Public("Yanis", "avatar6")
        val enemy1 = Public("Yuhan", "avatar5")
        val enemy2 = Public("Nhien", "avatar4")
        val fakeLobby =
            Lobby("", "", "", arrayListOf(user.userPublic, teammate1, enemy1, enemy2), 0)
        gameFragment = GameFragment(
            fakeLobby,
            arrayListOf(
                user.userPublic.username,
                teammate1.username,
                enemy1.username,
                enemy2.username
            ),
            arrayOf(),
            arrayOf(),
            false,
            false,
            true
        )
        chatFragment = ChatFragment(true, Room("Tutorial"), true)

        fm.beginTransaction().add(R.id.game_fragment_tutorial, gameFragment, "Game").commit()
        fm.beginTransaction().add(R.id.chat_fragment_tutorial, chatFragment, "Chat").commit()

        backBtn = activity?.findViewById<ImageButton>(R.id.ic_back)!!
        tutorialBtn = activity?.findViewById<ImageButton>(R.id.ic_tutorial)!!
        leaderboardBtn = activity?.findViewById<ImageButton>(R.id.ic_leaderboard)!!
        profileBtn = activity?.findViewById<ImageButton>(R.id.ic_profile)!!
        settingsBtn = activity?.findViewById<ImageButton>(R.id.ic_settings)!!

        val builder = AlertDialog.Builder(context)
        val dialog = builder
            .setTitle(context?.getString(R.string.tutorial_label))
            .setMessage(context?.getString(R.string.tutorial_question))
            .setPositiveButton(context?.getString(R.string.start_tutorial), null)
            .create()

        dialog.show()
        dialog.getButton(AlertDialog.BUTTON_POSITIVE)
            .setBackgroundColor(resources.getColor(R.color.dark_middle_blue, null))
        dialog.getButton(AlertDialog.BUTTON_POSITIVE)
            .setTextColor(resources.getColor(R.color.white, null))

        backBtn.visibility = View.VISIBLE
        backBtn.setOnClickListener {
            if (currentStep != steps.size - 1) {

                val builderQuit = AlertDialog.Builder(context)
                val dialogQuit = builderQuit
                    .setTitle(context?.getString(R.string.quit_tutorial_label))
                    .setMessage(context?.getString(R.string.qui_tutorial_question))
                    .setPositiveButton(
                        context?.getString(R.string.cancel), null)
                    .setNegativeButton(
                        context?.getString(R.string.leave_chat)
                    ) { _, _ ->
                        tutorialBtn.visibility = View.VISIBLE
                        leaderboardBtn.visibility = View.VISIBLE
                        profileBtn.visibility = View.VISIBLE
                        settingsBtn.visibility = View.VISIBLE
                        findNavController().navigate(R.id.action_tutorialFragment_to_menuFragment)
                    }
                    .create()

                dialogQuit.show()
                dialogQuit.getButton(AlertDialog.BUTTON_NEGATIVE)
                    .setBackgroundColor(resources.getColor(R.color.dark_middle_blue, null))
                dialogQuit.getButton(AlertDialog.BUTTON_NEGATIVE)
                    .setTextColor(resources.getColor(R.color.white, null))
                dialogQuit.getButton(AlertDialog.BUTTON_POSITIVE)
                    .setBackgroundColor(resources.getColor(R.color.red, null))
                dialogQuit.getButton(AlertDialog.BUTTON_POSITIVE)
                    .setTextColor(resources.getColor(R.color.white, null))
            } else {
                tutorialBtn.visibility = View.VISIBLE
                leaderboardBtn.visibility = View.VISIBLE
                profileBtn.visibility = View.VISIBLE
                settingsBtn.visibility = View.VISIBLE
                findNavController().navigate(R.id.action_tutorialFragment_to_menuFragment)
            }
        }

        progressBar = activity?.findViewById(R.id.simpleProgressBar)!!
        progressBar.setProgress(0, true)

        filterView = activity?.findViewById(R.id.tutorial_filter)!!
        textInfoBar = activity?.findViewById(R.id.text_info_bar)!!
        textInfoWrapper = activity?.findViewById(R.id.text_info_wrapper)!!

        finishTutorial = activity?.findViewById(R.id.finish_tutorial_button)!!
        finishTutorial.visibility = View.GONE
        finishTutorial.setOnClickListener { findNavController().navigate(R.id.action_tutorialFragment_to_menuFragment) }

        arrowNext = activity?.findViewById(R.id.tutorial_arrow_forward)!!
        arrowNext.setOnClickListener { nextStep() }

        arrowPrev = activity?.findViewById(R.id.tutorial_arrow_back)!!
        arrowPrev.setOnClickListener { prevStep() }
        arrowPrev.visibility = View.GONE

        filterView.changeFilter(steps[currentStep])
        updateText()
    }

    @RequiresApi(Build.VERSION_CODES.N)
    private fun nextStep() {
        if (steps[currentStep] == TutorialStep.Drawing) {
            gameFragment.drawFragment.disableCanvas()
            gameFragment.currentWordView.text = "_ _ _ _ _ _"
            arrowNext.visibility = View.VISIBLE
        } else if (steps[currentStep] == TutorialStep.Guessing) {
            gameFragment.socket.socket.emit("stop-word", "Tutorial" + user.userPublic.username)
            guessCounter = 0
            chatFragment.setSendListener()
            arrowNext.visibility = View.GONE
            gameFragment.drawFragment.clearCanvas()
        }
        ++currentStep
        if (currentStep == steps.size - 1) {
            arrowNext.visibility = View.GONE
            finishTutorial.visibility = View.VISIBLE
        } else if (currentStep == 1) {
            arrowPrev.visibility = View.VISIBLE
        }
        progressBar.setProgress(
            ((currentStep.toFloat() / steps.size.toFloat()) * 100).toInt(),
            true
        )
        filterView.changeFilter(steps[currentStep])
        updateText()
    }

    @RequiresApi(Build.VERSION_CODES.N)
    private fun prevStep() {
        if (steps[currentStep] == TutorialStep.Drawing) {
            gameFragment.drawFragment.disableCanvas()
            gameFragment.currentWordView.text = "_ _ _ _ _ _"
            arrowNext.visibility = View.VISIBLE
        } else if (steps[currentStep] == TutorialStep.Guessing) {
            gameFragment.drawFragment.clearCanvas()
            gameFragment.socket.socket.emit("stop-word", "Tutorial" + user.userPublic.username)
            guessCounter = 0
            chatFragment.setSendListener()
            arrowNext.visibility = View.VISIBLE
        }

        --currentStep
        if (currentStep == 0) {
            arrowPrev.visibility = View.GONE
        } else if (currentStep == steps.size - 2) {
            arrowNext.visibility = View.VISIBLE
            finishTutorial.visibility = View.GONE
        }
        progressBar.setProgress(
            ((currentStep.toFloat() / steps.size.toFloat()) * 100).toInt(),
            true
        )
        filterView.changeFilter(steps[currentStep])
        updateText()
    }

    @SuppressLint("ClickableViewAccessibility")
    private fun updateText() {
        when (steps[currentStep]) {
            TutorialStep.TopBar -> {
                val params = FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.WRAP_CONTENT,
                    FrameLayout.LayoutParams.WRAP_CONTENT
                )
                params.setMargins(450, 300, 0, 0)
                textInfoWrapper.layoutParams = params
                textInfoBar.text = context?.getText(R.string.tutorial1)
            }
            TutorialStep.LeftBar -> {
                val params = FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.WRAP_CONTENT,
                    FrameLayout.LayoutParams.WRAP_CONTENT
                )
                params.setMargins(450, 300, 0, 0)
                textInfoWrapper.layoutParams = params
                textInfoBar.text = context?.getText(R.string.tutorial2)
            }
            TutorialStep.Tools -> {
                val params = FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.WRAP_CONTENT,
                    FrameLayout.LayoutParams.WRAP_CONTENT
                )
                params.setMargins(550, 300, 0, 0)
                textInfoWrapper.layoutParams = params
                textInfoBar.text = context?.getText(R.string.tutorial3)
                gameFragment.drawFragment.showTools()
            }
            TutorialStep.Drawing -> {
                val params = FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.WRAP_CONTENT,
                    FrameLayout.LayoutParams.WRAP_CONTENT
                )
                params.setMargins(1250, 300, 0, 0)
                textInfoWrapper.layoutParams = params
                textInfoBar.text = context?.getText(R.string.tutorial4)
                gameFragment.drawFragment.enableCanvas()
                gameFragment.currentWordView.text = "Apple"
                gameFragment.currentRoleView.text = "Drawing"
                gameFragment.drawFragment.canvasView.setOnTouchListener { _, event ->
                    if (event.action == MotionEvent.ACTION_UP) arrowNext.visibility = View.VISIBLE
                    return@setOnTouchListener false
                }
                arrowNext.visibility = View.GONE
            }
            TutorialStep.TeammateGuessed -> {
                val params = FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.WRAP_CONTENT,
                    FrameLayout.LayoutParams.WRAP_CONTENT
                )
                params.setMargins(450, 100, 0, 0)
                textInfoWrapper.layoutParams = params
                textInfoBar.text = context?.getText(R.string.tutorial5)
                chatFragment.addItemToRecyclerView(
                    Message(
                        "apple",
                        "Yanis",
                        "",
                        MessageType.MESSAGE_OTHER,
                        chatFragment.room.name,
                        "avatar6"
                    )
                )
                gameFragment.score[0] = 1
                gameFragment.showScoreBoard()
            }
            TutorialStep.Guessing -> {
                val params = FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.WRAP_CONTENT,
                    FrameLayout.LayoutParams.WRAP_CONTENT
                )
                params.setMargins(1050, 100, 0, 0)
                textInfoWrapper.layoutParams = params
                textInfoBar.text = context?.getText(R.string.tutorial6)
                gameFragment.currentRoleView.text = "Guessing"
                gameFragment.drawFragment.clearCanvas()
                gameFragment.drawFragment.enableDrawEvent()
                val guessText =
                    context?.getString(R.string.role_guessing) + " " + currentTries.toString() + "/" + 3
                activity?.findViewById<TextView>(R.id.game_current_role)!!.text = guessText
                gameFragment.socket.socket.emit("join-game", "Tutorial" + user.userPublic.username)
                gameFragment.socket.socket.emit(
                    "word-image",
                    Gson().toJson(WordImage("banana", "Tutorial" + user.userPublic.username))
                )
                chatFragment.send.setOnClickListener {
                    var messageText =
                        view?.findViewById<TextInputEditText>(R.id.user_message)?.text.toString()
                            .trim()
                    view?.findViewById<TextInputEditText>(R.id.user_message)?.setText("")
                    val isCorrectWord = messageText.toLowerCase() == "banana"
                    if (isCorrectWord || ++guessCounter == 3)
                        arrowNext.visibility = View.VISIBLE
                    if (!isCorrectWord && currentTries != 0) {
                        currentTries--
                        val guessText =
                            context?.getString(R.string.role_guessing) + " " + currentTries.toString() + "/" + 3
                        activity?.findViewById<TextView>(R.id.game_current_role)!!.text = guessText
                    }
                    val message = Message(
                        messageText,
                        user.userPublic.username,
                        "",
                        if (isCorrectWord) MessageType.MESSAGE_OWN_CORRECT else MessageType.MESSAGE_OWN_WRONG,
                        chatFragment.room.name,
                        user.userPublic.avatar
                    )
                    chatFragment.addItemToRecyclerView(message)
                }
                arrowNext.visibility = View.GONE
            }
            TutorialStep.Finish -> {
                val params = FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.WRAP_CONTENT,
                    FrameLayout.LayoutParams.WRAP_CONTENT
                )
                params.setMargins(450, 100, 0, 0)
                textInfoWrapper.layoutParams = params
                textInfoBar.text = context?.getText(R.string.tutorial7)
            }
        }
    }

    class TutorialFilterView(context: Context, attrs: AttributeSet) : View(context, attrs) {
        private var temp: Canvas? = null
        private var paint: Paint? = null
        private val p = Paint()
        private var transparentPaint: Paint? = null
        private var bitmap: Bitmap? = null
        private var newLeft = 0f
        private var newTop = 0f
        private var newRight = 1240f
        private var newBottom = 250f
        private var left = 0f
        private var top = 0f
        private var right = 1240f
        private var bottom = 250f

        override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
            super.onSizeChanged(w, h, oldw, oldh)
            bitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
            temp = Canvas(bitmap!!)
            paint = Paint()
            paint!!.color = context.resources.getColor(R.color.background_tutorial, null)
            transparentPaint = Paint()
            transparentPaint!!.xfermode = PorterDuffXfermode(PorterDuff.Mode.CLEAR)
            temp!!.drawRect(0f, 0f, width.toFloat(), height.toFloat(), paint!!)
        }

        override fun onDraw(canvas: Canvas) {
            temp!!.drawRect(left, top, right, bottom, paint!!)
            temp!!.drawRect(newLeft, newTop, newRight, newBottom, transparentPaint!!)
            left = newLeft
            top = newTop
            right = newRight
            bottom = newBottom
            canvas.drawBitmap(bitmap!!, 0f, 0f, p)
        }

        fun changeFilter(currentStep: TutorialStep) {
            when (currentStep) {
                TutorialStep.TopBar -> {
                    newLeft = 0f
                    newTop = 0f
                    newRight = 1240f
                    newBottom = 225f
                }
                TutorialStep.LeftBar -> {
                    newLeft = 0f
                    newTop = 250f
                    newRight = 250f
                    newBottom = 1225f
                }
                TutorialStep.Tools -> {
                    newLeft = 250f
                    newTop = 950f
                    newRight = 1165f
                    newBottom = 1075f
                }
                TutorialStep.Drawing -> {
                    newLeft = 225f
                    newTop = 0f
                    newRight = 1200f
                    newBottom = 1250f
                }
                TutorialStep.TeammateGuessed -> {
                    newLeft = 1240f
                    newTop = 0f
                    newRight = 2000f
                    newBottom = 1250f
                }
                TutorialStep.Guessing -> {
                    newLeft = 250f
                    newTop = 0f
                    newRight = 2000f
                    newBottom = 1250f
                }
                TutorialStep.Finish -> {
                    newLeft = 0f
                    newTop = 0f
                    newRight = 2000f
                    newBottom = 1250f
                }
            }
            invalidate()
        }
    }

}