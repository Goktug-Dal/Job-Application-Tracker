import os
import argparse
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "job_application_tracker.settings")
django.setup()

from django.contrib.auth.models import User
from base.models import Job

def resolve_work_type(args):
    if args.remote:
        return (True, False, False)
    elif args.hybrid:
        return (False, True, False)
    else:
        return (False, False, True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Add a Job Application via CLI")

    parser.add_argument('-n', '--name', required=True, help="Job title")
    parser.add_argument('-l', '--link', required=True, help="Application link (URL)")
    parser.add_argument('-u', '--username', required=True, help="Django username")
    parser.add_argument('-c', '--company', default="Unknown", help="Company name")
    parser.add_argument('--work_duration', type=int, default=0, help="Work duration in days")

    parser.add_argument('--applied', action="store_true")
    parser.add_argument('--no_response', action="store_true")
    parser.add_argument('--rejected', action="store_true")
    parser.add_argument('--accepted', action="store_true")
    parser.add_argument('--interview', action="store_true")
    parser.add_argument('--hold', action="store_true")

    work_type_group = parser.add_mutually_exclusive_group()
    work_type_group.add_argument('--remote', action="store_true")
    work_type_group.add_argument('--hybrid', action="store_true")
    work_type_group.add_argument('--office', action="store_true")

    args = parser.parse_args()

    is_remote, is_hybrid, is_office = resolve_work_type(args)

    try:
        user = User.objects.get(username=args.username)
    except User.DoesNotExist:
        print(f'Error: User "{args.username}" does not exist.')
        print('Available users:')
        for u in User.objects.all():
            print(f'  - {u.username}')
        exit(1)

    try:
        job = Job.objects.create(
            name=args.name,
            company=args.company,
            apply_link=args.link,
            user=user,
            is_applied=args.applied,
            is_no_response=args.no_response,
            is_rejected=args.rejected,
            is_accepted=args.accepted,
            in_interview_process=args.interview,
            on_hold=args.hold,
            is_remote=is_remote,
            is_hybrid=is_hybrid,
            is_office=is_office,
            day_work_duration=args.work_duration,
        )
    except Exception as e:
        print(f"Database error: {e}")
        exit(1)

    print("Job added successfully.")
    print("-" * 40)
    print(f"ID            : {job.id}")
    print(f"Username      : {args.username}")
    print(f"Job Name      : {args.name}")
    print(f"Company       : {args.company}")
    print(f"Link          : {args.link}")
    print(f"Work Duration : {args.work_duration} days")

    print("\nStatus:")
    print(f"  Applied       : {args.applied}")
    print(f"  No Response   : {args.no_response}")
    print(f"  Rejected      : {args.rejected}")
    print(f"  Accepted      : {args.accepted}")
    print(f"  Interview     : {args.interview}")
    print(f"  Hold          : {args.hold}")

    print("\nWork Type:")
    if is_remote:
        print("  Remote")
    elif is_hybrid:
        print("  Hybrid")
    else:
        print("  Office")
    print("-" * 40)