package com.example.thin_client.fragment

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.content.Context
import android.content.DialogInterface
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Path
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.os.SystemClock
import android.view.*
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.SeekBar
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.core.content.res.ResourcesCompat
import androidx.fragment.app.Fragment
import com.example.thin_client.ChatSocket
import com.example.thin_client.R
import com.example.thin_client.model.Action
import com.example.thin_client.model.ActionType
import com.example.thin_client.model.Line
import com.google.gson.Gson
import com.skydoves.colorpickerview.ColorEnvelope
import com.skydoves.colorpickerview.ColorPickerDialog
import com.skydoves.colorpickerview.listeners.ColorEnvelopeListener
import io.socket.emitter.Emitter
import okhttp3.internal.toHexString
import org.json.JSONObject
import java.util.concurrent.CopyOnWriteArrayList


class DrawFragment : Fragment() {
    lateinit var canvasView: MyCanvasView
    private var defaultColor: Int = 0
    private lateinit var colorButton: ImageButton
    private lateinit var pencilButton: ImageButton
    private lateinit var eraserButton: ImageButton
    private lateinit var gridButton: ImageButton
    private var gridIsOn = false
    var socket = ChatSocket()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment

        return inflater.inflate(R.layout.fragment_draw, container, false)
    }

    @SuppressLint("ResourceAsColor")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        canvasView = MyCanvasView(requireContext(), socket)

        defaultColor =
            ContextCompat.getColor(requireContext(), R.color.design_default_color_primary)

        socket.init()
        socket.socket.on("draw", onDrawEvent)

        colorButton = view.findViewById(R.id.color_button)
        pencilButton = view.findViewById(R.id.pencil_button)
        eraserButton = view.findViewById(R.id.eraser_button)
        gridButton = view.findViewById(R.id.grid_button)

        view.findViewById<LinearLayout>(R.id.canvas)?.setBackgroundResource(R.color.white)
        view.findViewById<LinearLayout>(R.id.canvas).addView(canvasView)

        colorButton.setOnClickListener {
            openColorPicker()
        }

        pencilButton.setOnClickListener {
            canvasView.isEraser = false
            pencilButton.setImageResource(R.drawable.ic_pencil_pressed)
            eraserButton.setImageResource(R.drawable.ic_eraser)
        }

        eraserButton.setOnClickListener {
            canvasView.isEraser = true
            pencilButton.setImageResource(R.drawable.ic_pencil)
            eraserButton.setImageResource(R.drawable.ic_eraser_pressed)
        }

        gridButton.setOnClickListener {
            gridButton()
            if (gridIsOn) {
                gridButton.setImageResource(R.drawable.ic_grid_pressed)
            } else {
                gridButton.setImageResource(R.drawable.ic_grid_toggle)
            }
        }

        view.findViewById<SeekBar>(R.id.thickness_seekBar).setOnSeekBarChangeListener(object :
            SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
                val value = seekBar?.progress?.plus(1)
                canvasView.paint.strokeWidth = value?.toFloat()!!
                view.findViewById<TextView>(R.id.display_thickness).text = value.toString()
            }

            override fun onStartTrackingTouch(seekBar: SeekBar?) {
            }

            override fun onStopTrackingTouch(seekBar: SeekBar?) {
            }

        })

        view.findViewById<ImageButton>(R.id.undo_button).setOnClickListener {
            canvasView.undo()
            val line = Line(
                canvasView.gameName,
                0f,
                0f,
                0,
                false,
                "",
                "",
                true,
                1
            )
            socket.socket.emit("draw", Gson().toJson(line))
        }
        view.findViewById<ImageButton>(R.id.redo_button).setOnClickListener {
            canvasView.redo()
            val line = Line(
                canvasView.gameName,
                0f,
                0f,
                0,
                false,
                "",
                "",
                true,
                2
            )
            socket.socket.emit("draw", Gson().toJson(line))
        }
        view.findViewById<LinearLayout>(R.id.draw_tools)?.visibility = View.GONE
    }

    fun openColorPicker() {
        val builder = ColorPickerDialog.Builder(context)
        val dialog = builder
            .setPreferenceName("MyColorPickerDialog")
            .setNegativeButton(getString(R.string.cancel),
                DialogInterface.OnClickListener { dialogInterface, _ -> dialogInterface.dismiss() })
            .setPositiveButton(getString(R.string.confirm),
                object : ColorEnvelopeListener {
                    override fun onColorSelected(envelope: ColorEnvelope?, fromUser: Boolean) {
                        if (envelope != null) {
                            canvasView.drawColor = envelope.color
                            colorButton.setBackgroundColor(envelope.color)
                        }
                    }
                })
            .attachAlphaSlideBar(true) // the default value is true.
            .attachBrightnessSlideBar(true) // the default value is true.
            .setBottomSpace(12) // set a bottom space between the last slidebar and buttons.
            .create()
        dialog.show()
        dialog.getButton(AlertDialog.BUTTON_POSITIVE)
            .setBackgroundColor(resources.getColor(R.color.dark_middle_blue, null))
        dialog.getButton(AlertDialog.BUTTON_POSITIVE)
            .setTextColor(resources.getColor(R.color.white, null))
        dialog.getButton(AlertDialog.BUTTON_NEGATIVE)
            .setBackgroundColor(resources.getColor(R.color.red, null))
        dialog.getButton(AlertDialog.BUTTON_NEGATIVE)
            .setTextColor(resources.getColor(R.color.white, null))
    }

    fun clearCanvas() {
        socket.socket.off("draw")
        canvasView.clearCanvas()
    }

    fun enableDrawEvent() {
        socket.socket.off("draw")
        socket.socket.on("draw", onDrawEvent)
    }

    fun disableCanvas() {
        canvasView.isCanvasDisabled = true
        hideTools()
    }

    fun enableCanvas() {
        canvasView.isCanvasDisabled = false
        canvasView.paint.color = (colorButton.background as ColorDrawable).color
        val value = view?.findViewById<SeekBar>(R.id.thickness_seekBar)?.progress
        canvasView.paint.strokeWidth = value?.toFloat()!!
        canvasView.isEraser = false
        showTools()
    }

    fun showTools() {
        activity?.runOnUiThread {
            view?.findViewById<LinearLayout>(R.id.draw_tools)?.visibility = View.VISIBLE
        }
    }

    fun hideTools() {
        activity?.runOnUiThread {
            view?.findViewById<LinearLayout>(R.id.draw_tools)?.visibility = View.GONE
        }
    }

    fun gridButton() {
        if (gridIsOn) {
            view?.findViewById<LinearLayout>(R.id.canvas)?.setBackgroundResource(R.color.white)
        } else {
            view?.findViewById<LinearLayout>(R.id.canvas)?.setBackgroundResource(R.drawable.ic_grid)
        }
        gridIsOn = !this.gridIsOn
    }

    private var onDrawEvent = Emitter.Listener {
        val drawEvent = it[0] as JSONObject
        val actionType = drawEvent["undo"] as Int
        if (actionType == ActionType.Undo.value) {
            canvasView.undo()
        } else if (actionType == ActionType.Redo.value) {
            canvasView.redo()
        } else if (actionType == ActionType.None.value) {
            val type = drawEvent["type"] as String
            var action = when (type) {
                "mousedown" -> MotionEvent.ACTION_DOWN
                "mousemove" -> MotionEvent.ACTION_MOVE
                "mouseup" -> MotionEvent.ACTION_UP
                "mouseleave" -> MotionEvent.ACTION_UP
                else -> MotionEvent.ACTION_MOVE
            }
            canvasView.depth = if (drawEvent.has("depth")) drawEvent["depth"] as Int else -1
            canvasView.isEraser = drawEvent["isEraser"] as Boolean


            var strokeWidth = if (drawEvent["strokeWidth"] is String) {
                (drawEvent["strokeWidth"] as String).toInt()
            } else {
                drawEvent["strokeWidth"] as Int
            }

            if (action != MotionEvent.ACTION_UP)
                canvasView.paint.strokeWidth = strokeWidth.toFloat()

            val isLight = drawEvent["isLight"] as Boolean

            var x = if (drawEvent["clientX"] is Int)
                (drawEvent["clientX"] as Int).toFloat()
            else
                (drawEvent["clientX"] as Double).toFloat()

            var y = if (drawEvent["clientY"] is Int)
                (drawEvent["clientY"] as Int).toFloat()
            else
                (drawEvent["clientY"] as Double).toFloat()

            // if (!isLight) {
            //     x *= (900f/675f)
            //     y *= (712f/578f)
            // }

            if (isLight && action != MotionEvent.ACTION_UP) {
                val colorString = drawEvent["color"] as String
                canvasView.drawColor = Color.parseColor("#$colorString")
            } else if (action != MotionEvent.ACTION_UP) {
                val colorString = drawEvent["color"] as String
                val color = colorString.substring(5, colorString.length - 1).split(",")
                val alpha = color[3].toFloat() * 255
                val colorInt =
                    Color.argb(alpha.toInt(), color[0].toInt(), color[1].toInt(), color[2].toInt())
                canvasView.drawColor = colorInt
            }

            var downTime = SystemClock.uptimeMillis()
            var eventTime = SystemClock.uptimeMillis()
            var event: MotionEvent = MotionEvent.obtain(downTime, eventTime, action, x, y, 0)
            canvasView.isSelfDrawing = false
            canvasView.onTouchEvent(event)
        }

    }

    fun setGameName(gameName: String) {
        canvasView.gameName = gameName
    }

    class MyCanvasView(context: Context, val socket: ChatSocket) : View(context) {

        // Holds the path you are currently drawing.
        private var path = Path()

        var drawColor = ResourcesCompat.getColor(resources, R.color.black, null)
        private val backgroundColor = ResourcesCompat.getColor(resources, R.color.white, null)

        //private lateinit var extraCanvas: Canvas
        var isEraser: Boolean = false
        var isSelfDrawing: Boolean = true
        var isCanvasDisabled: Boolean = true
        private var actions: CopyOnWriteArrayList<Action> = CopyOnWriteArrayList()
        private var undoActions: CopyOnWriteArrayList<Action> = CopyOnWriteArrayList()
        var gameName: String = ""
        var depth: Int = -1

        // Set up the paint with which to draw.
        val paint = Paint().apply {
            color = drawColor
            // Smooths out edges of what is drawn without affecting shape.
            isAntiAlias = true
            // Dithering affects how colors with higher-precision than the device are down-sampled.
            isDither = true
            style = Paint.Style.STROKE // default: FILL
            strokeJoin = Paint.Join.ROUND // default: MITER
            strokeCap = Paint.Cap.ROUND // default: BUTT
            strokeWidth = 1f // default: Hairline-width (really thin)
        }

        /**
         * Don't draw every single pixel.
         * If the finger has has moved less than this distance, don't draw. scaledTouchSlop, returns
         * the distance in pixels a touch can wander before we think the user is scrolling.
         */
        private val touchTolerance = ViewConfiguration.get(context).scaledTouchSlop

        private var currentX = 0f
        private var currentY = 0f

        private var motionTouchEventX = 0f
        private var motionTouchEventY = 0f

        /**
         * Called whenever the view changes size.
         * Since the view starts out with no size, this is also called after
         * the view has been inflated and has a valid size.
         */
        override fun onSizeChanged(width: Int, height: Int, oldWidth: Int, oldHeight: Int) {
            super.onSizeChanged(width, height, oldWidth, oldHeight)
            //extraCanvas = Canvas()
        }

        override fun onDraw(canvas: Canvas) {
            var isDrawn = false
            for (action in actions) {
                if (action.depth >= depth && !isDrawn && depth != -1) {
                    isDrawn = true
                    canvas.drawPath(path, paint)
                }
                canvas.drawPath(action.path, action.paint)
            }

            if (depth == -1 || !isDrawn)
                canvas.drawPath(path, paint)
        }

        fun undo() {
            if (actions.size > 0) {
                undoActions.add(actions.removeAt(actions.size - 1))
                invalidate()
            }
        }

        fun redo() {
            if (undoActions.size > 0) {
                actions.add(undoActions.removeAt(undoActions.size - 1))
                invalidate()
            }
        }

        fun clearCanvas() {
            actions.clear()
            undoActions.clear()
            drawColor = Color.BLACK
            path.reset()
            invalidate()
        }

        override fun onTouchEvent(event: MotionEvent): Boolean {
            if (!isCanvasDisabled || !isSelfDrawing) {
                motionTouchEventX = event.x
                motionTouchEventY = event.y

                when (event.action) {
                    MotionEvent.ACTION_DOWN -> touchStart()
                    MotionEvent.ACTION_MOVE -> touchMove()
                    MotionEvent.ACTION_UP -> touchUp()
                }
                return true
            }
            return false
        }

        private fun touchStart() {

            if (isEraser)
                paint.color = backgroundColor
            else
                paint.color = drawColor

            path.reset()
            undoActions.clear()
            path.moveTo(motionTouchEventX, motionTouchEventY)
            currentX = motionTouchEventX
            currentY = motionTouchEventY

            if (isSelfDrawing) {
                val line = Line(
                    gameName,
                    currentX,
                    currentY,
                    paint.strokeWidth.toInt(),
                    isEraser,
                    "mousedown",
                    paint.color.toHexString(),
                    true,
                    0
                )
                socket.socket.emit("draw", Gson().toJson(line))
            }
            isSelfDrawing = true
        }

        private fun touchMove() {
            val dx = Math.abs(motionTouchEventX - currentX)
            val dy = Math.abs(motionTouchEventY - currentY)
            if (dx >= touchTolerance || dy >= touchTolerance) {
                path.lineTo(motionTouchEventX, motionTouchEventY)

                if (isSelfDrawing) {
                    val line = Line(
                        gameName,
                        currentX,
                        currentY,
                        paint.strokeWidth.toInt(),
                        isEraser,
                        "mousemove",
                        paint.color.toHexString(),
                        true,
                        0
                    )
                    socket.socket.emit("draw", Gson().toJson(line))
                }

                currentX = motionTouchEventX
                currentY = motionTouchEventY
            }
            isSelfDrawing = true
            invalidate()
        }

        private fun touchUp() {
            path.lineTo(currentX, currentY)
            //extraCanvas.drawPath(path, paint)
            if (depth != -1) {
                val index = actions.indexOfFirst { action -> action.depth >= depth }
                if (index == -1) {
                    actions.add(Action(Path(path), Paint(paint), depth))
                } else {
                    actions.add(index, Action(Path(path), Paint(paint), depth))
                }
            } else {
                actions.add(Action(Path(path), Paint(paint), -1))
            }
            depth = -1
            path.reset()
            if (isSelfDrawing) {
                val line = Line(
                    gameName,
                    currentX,
                    currentY,
                    paint.strokeWidth.toInt(),
                    isEraser,
                    "mouseup",
                    paint.color.toHexString(),
                    true,
                    0
                )
                socket.socket.emit("draw", Gson().toJson(line))
            }
            isSelfDrawing = true
        }
    }
}
