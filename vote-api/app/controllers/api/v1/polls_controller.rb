class Api::V1::PollsController < ApplicationController
  def index
    render json: Poll.all, include: :votes
  end

  def show
    poll = Poll.find(params[:id])
     votes_count = poll.votes.group(:option).count
    render json: {
      id: poll.id,
      title: poll.title,
      options: poll.options,
      votes: poll.votes || {}
    }
  end

  def update
    poll = Poll.find(params[:id])
    if poll.update(poll_params)
      render json: poll
    else
      render json: { error: 'Помилка оновлення' }, status: :unprocessable_entity
    end
  end

  def vote
    poll = Poll.find(params[:id])
    option = params[:option]

    unless poll.options.include?(option)
      return render json: { error: "Invalid option" }, status: :unprocessable_entity
    end

      Vote.create!(poll: poll, option: option)

  votes_count = poll.votes.group(:option).count
    poll.save!

    render json: { success: true, votes: poll.votes }
  end

  private

  def poll_params
    params.require(:poll).permit(:title, options: [])
  end
end
