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

def create
  Rails.logger.debug "Параметри для створення: #{params.inspect}"
  poll = Poll.new(poll_params)
  if poll.save
    render json: poll, status: :created
  else
    render json: { error: poll.errors.full_messages }, status: :unprocessable_entity
  end
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
    render json: { success: true, votes: votes_count }
  end

  private

  def poll_params
    params.require(:poll).permit(:title, options: [])
  end
end
